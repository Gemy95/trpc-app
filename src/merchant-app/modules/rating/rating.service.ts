import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { ADD_RATING, UPDATE_RATING } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { ORDER_NOT_RATED, ORDER_RATE_IGNORED, ORDER_RATED } from '../common/constants/rate-status.constants';
import { OrderRepository, RatingRepository } from '../models';
import { CreateRatingDto } from './dto/create-rating.dto';
import { DashboardRatingQuery } from './dto/dashboard-rating-query.dto';
import { HideCommentRatingDto } from './dto/hide-commend.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    private ratingRepository: RatingRepository,
    private readonly orderRepository: OrderRepository,
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
  ) {}
  private logger = new Logger(Rating.name);

  public async rateOrder(user: any, order: string, createRatingDto: CreateRatingDto) {
    if (createRatingDto.ignore == true) {
      return this.ignoreRate(order);
    }
    const existingOrder = await this.orderRepository.getOne(
      { _id: new mongoose.Types.ObjectId(order), rateStatus: ORDER_NOT_RATED },
      {
        lean: true,
        populate: [{ path: 'branchId', select: '_id merchantId' }],
        fields: { _id: 1, branchId: 1 },
      },
    );

    if (!existingOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

    const newRating = new Rating();
    newRating.extraNote = createRatingDto.extraNote ? createRatingDto.extraNote : null;
    newRating.comment = createRatingDto.comment ? createRatingDto.comment : null;
    newRating.rating = new mongoose.Types.ObjectId(createRatingDto.rating);
    newRating.client = new mongoose.Types.ObjectId(user?._id);
    newRating.order = new mongoose.Types.ObjectId(order);
    newRating.branch = new mongoose.Types.ObjectId(existingOrder?.branchId['_id']);
    newRating.merchant = new mongoose.Types.ObjectId(existingOrder?.branchId['merchantId']);
    try {
      await Promise.all([
        await this.ratingRepository.create(newRating),
        await this.orderRepository.updateOne({ _id: new mongoose.Types.ObjectId(order) }, { rateStatus: ORDER_RATED }),
      ]);

      const created = await this.ratingRepository.getOne(
        {
          order: new mongoose.Types.ObjectId(order),
        },
        {
          populate: ['rating', 'order'],
          lean: true,
        },
      );
      if (!created) throw new BadRequestException(ERROR_CODES.err_failed_to_create_rating);

      const addRatingActivity = new Activity();
      addRatingActivity.rating = created._id;
      addRatingActivity.branch = created.branch;
      addRatingActivity.merchant = created.merchant;
      addRatingActivity.actor = user?._id;
      addRatingActivity.order = created.order['_id'];
      addRatingActivity.rate = created.rating['level'];
      addRatingActivity.scope = 'Client';

      this.activitiesClient.emit(ADD_RATING, addRatingActivity);

      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  private async ignoreRate(order: string) {
    try {
      await this.orderRepository.updateOne(
        { _id: new mongoose.Types.ObjectId(order) },
        { rateStatus: ORDER_RATE_IGNORED },
      );
      return { success: true };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  }

  public getLatestOrder(user: any) {
    return this.orderRepository.getLatestOrder(user?._id);
  }

  public async marketPlaceRating(merchant: string) {
    try {
      const [ratings] = await this.ratingRepository.marketPlaceRating(merchant);
      if (!ratings) return { success: true };
      return {
        success: true,
        totalRates: ratings?.TotalRatings ? ratings.TotalRatings.count : 0,
        avgOrdersRating: ratings?.AverageRatings ? ratings.AverageRatings.avgOrdersRating : 0,
        levels: [
          { 1: ratings?.ScaleOne ? ratings.ScaleOne.rating : 0 },
          { 2: ratings?.ScaleTwo ? ratings.ScaleTwo.rating : 0 },
          { 3: ratings?.ScaleThree ? ratings.ScaleThree.rating : 0 },
          { 4: ratings?.ScaleFour ? ratings.ScaleFour.rating : 0 },
          { 5: ratings?.ScaleFive ? ratings.ScaleFive.rating : 0 },
        ],
        data: ratings?.Ratings ? ratings.Ratings.data : [],
      };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  }

  public async getBranchOrdersRating(branch: string) {
    try {
      const [ratings] = await this.ratingRepository._model.aggregate([
        {
          $lookup: {
            from: 'ratingscales',
            localField: 'rating',
            foreignField: '_id',
            as: 'rating',
          },
        },
        {
          $match: {
            branch: new mongoose.Types.ObjectId(branch),
          },
        },
        {
          $unwind: '$rating',
        },
        {
          $project: {
            _id: 1,
            rating: {
              _id: 1,
              name: 1,
              translation: 1,
              level: 1,
            },
            comment: { $cond: [{ $eq: ['$is_public', true] }, '$comment', null] },
            extraNote: 1,
            branch: 1,
          },
        },
        {
          $group: {
            _id: '$branch',
            avgOrdersRating: { $avg: { $ifNull: ['$rating.level', 0] } },
            ratings: {
              $push: '$$ROOT',
            },
          },
        },
      ]);
      if (!ratings) return { success: true };
      return {
        success: true,
        ratings,
      };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  }

  public async dashboardRating(merchant: string, query: DashboardRatingQuery) {
    try {
      const ratings = await this.ratingRepository.dashboardRating(merchant, query);
      if (!ratings) return { success: true };

      return {
        success: true,
        ratings: ratings?.Ratings,
        levelOneCount: ratings?.ScaleOne ? ratings.ScaleOne.count : 0,
        levelTwoCount: ratings?.ScaleTwo ? ratings.ScaleTwo.count : 0,
        levelThreeCount: ratings?.ScaleThree ? ratings.ScaleThree.count : 0,
        levelFourCount: ratings?.ScaleFour ? ratings.ScaleFour.count : 0,
        levelFiveCount: ratings?.ScaleFive ? ratings.ScaleFive.count : 0,
        totalRatings: ratings?.TotalRatings ? ratings.TotalRatings.count : 0,
        page: ratings.page,
        pages: ratings.pages,
        length: ratings.length,
      };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  }

  public async hideComment(user: any, merchant: string, rate: string, body: HideCommentRatingDto) {
    try {
      const hidden = await this.ratingRepository.updateOne(
        {
          _id: new mongoose.Types.ObjectId(rate),
          merchant: new mongoose.Types.ObjectId(merchant),
        },
        { is_public: body.is_public },
        { lean: true, new: true },
      );

      const addRatingActivity = new Activity();
      addRatingActivity.actor = user?._id;
      addRatingActivity.rating = hidden._id;
      addRatingActivity.branch = hidden.branch;
      addRatingActivity.merchant = hidden.merchant;
      addRatingActivity.order = hidden.order;
      addRatingActivity.scope = user?.type;

      this.activitiesClient.emit(UPDATE_RATING, addRatingActivity);

      return { success: true };
    } catch (error) {
      return { success: false, message: `${error}` };
    }
  }
}
