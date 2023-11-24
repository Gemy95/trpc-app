import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Rating } from '../../../../libs/database/src/lib/models/rating/rating.schema';
import generateFilters from '../../common/utils/generate-filters';
import { DashboardRatingQuery } from '../../rating/dto/dashboard-rating-query.dto';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(
    @InjectModel(Rating.name)
    private readonly nModel: Model<Rating>,
  ) {
    super(nModel);
  }

  async marketPlaceRating(merchant: string) {
    return this._model.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchant),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'ratingscales',
          localField: 'rating',
          foreignField: '_id',
          as: 'rating',
        },
      },
      {
        $facet: {
          Ratings: [
            {
              $match: {
                is_public: true,
              },
            },
            {
              $lookup: {
                from: 'orders',
                localField: 'order',
                foreignField: '_id',
                as: 'order',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'order.orderCreatedBy',
                foreignField: '_id',
                as: 'client',
              },
            },
            {
              $lookup: {
                from: 'branches',
                localField: 'order.branchId',
                foreignField: '_id',
                as: 'branch',
              },
            },
            { $unwind: '$rating' },
            { $unwind: '$order' },
            { $unwind: '$client' },
            { $unwind: '$branch' },
            {
              $project: {
                _id: 1,
                rating: {
                  _id: 1,
                  name: 1,
                  translation: 1,
                  level: 1,
                },
                merchant: 1,
                rate: '$rating.level',
                createdAt: 1,
                comment: {
                  $cond: [{ $eq: ['$is_public', true] }, '$comment', null],
                },
                client: '$client.name',
              },
            },
            {
              $group: {
                _id: '$merchant',
                data: {
                  $push: '$$ROOT',
                },
              },
            },
            {
              $project: {
                _id: 1,
                data: {
                  rate: 1,
                  createdAt: 1,
                  comment: 1,
                  client: 1,
                },
              },
            },
          ],
          AverageRatings: [
            {
              $lookup: {
                from: 'orders',
                localField: 'order',
                foreignField: '_id',
                as: 'order',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'order.orderCreatedBy',
                foreignField: '_id',
                as: 'client',
              },
            },
            {
              $lookup: {
                from: 'branches',
                localField: 'order.branchId',
                foreignField: '_id',
                as: 'branch',
              },
            },
            { $unwind: '$rating' },
            { $unwind: '$order' },
            { $unwind: '$client' },
            { $unwind: '$branch' },
            {
              $project: {
                _id: 1,
                rating: {
                  _id: 1,
                  name: 1,
                  translation: 1,
                  level: 1,
                },
                merchant: 1,
                rate: '$rating.level',
                createdAt: 1,
                comment: {
                  $cond: [{ $eq: ['$is_public', true] }, '$comment', null],
                },
                client: '$client.name',
              },
            },
            {
              $group: {
                _id: '$merchant',
                avgOrdersRating: { $avg: { $ifNull: ['$rating.level', 0] } },
                data: {
                  $push: '$$ROOT',
                },
              },
            },
            {
              $project: {
                _id: 1,
                avgOrdersRating: { $round: ['$avgOrdersRating', 1] },
                // data: {
                //   rate: 1,
                //   createdAt: 1,
                //   comment: 1,
                //   client: 1,
                // },
              },
            },
          ],
          ScaleOne: [
            {
              $match: {
                'rating.level': 1,
              },
            },
            {
              $group: {
                _id: '$rating._id',
                rating: { $first: '$rating' },
                count: { $sum: 1 },
              },
            },
            {
              $unwind: {
                path: '$rating',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                rating: {
                  level: 1,
                  name: 1,
                  translation: 1,
                  rates: '$count',
                },
              },
            },
          ],
          ScaleTwo: [
            {
              $match: {
                'rating.level': 2,
              },
            },
            {
              $group: {
                _id: '$rating._id',
                rating: { $first: '$rating' },
                count: { $sum: 1 },
              },
            },
            {
              $unwind: {
                path: '$rating',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                rating: {
                  level: 1,
                  name: 1,
                  translation: 1,
                  rates: '$count',
                },
              },
            },
          ],
          ScaleThree: [
            {
              $match: {
                'rating.level': 3,
              },
            },
            {
              $group: {
                _id: '$rating._id',
                rating: { $first: '$rating' },
                count: { $sum: 1 },
              },
            },
            {
              $unwind: {
                path: '$rating',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                rating: {
                  level: 1,
                  name: 1,
                  translation: 1,
                  rates: '$count',
                },
              },
            },
          ],
          ScaleFour: [
            {
              $match: {
                'rating.level': 4,
              },
            },
            {
              $group: {
                _id: '$rating._id',
                rating: { $first: '$rating' },
                count: { $sum: 1 },
              },
            },
            {
              $unwind: {
                path: '$rating',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                rating: {
                  level: 1,
                  name: 1,
                  translation: 1,
                  rates: '$count',
                },
              },
            },
          ],
          ScaleFive: [
            {
              $match: {
                'rating.level': 5,
              },
            },
            {
              $group: {
                _id: '$rating._id',
                rating: { $first: '$rating' },
                count: { $sum: 1 },
              },
            },
            {
              $unwind: {
                path: '$rating',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                rating: {
                  level: 1,
                  name: 1,
                  translation: 1,
                  rates: '$count',
                },
              },
            },
          ],
          TotalRatings: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$Ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$AverageRatings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleOne',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleTwo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleThree',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleFour',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleFive',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$TotalRatings',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  async dashboardRating(merchant: string, query: DashboardRatingQuery) {
    const { limit, page, paginate, ...rest } = query;
    const generatedMatch = generateFilters(rest);

    if (generatedMatch['orderRefId']) {
      delete Object.assign(generatedMatch, {
        'order.orderRefId': generatedMatch['orderRefId'],
      })['orderRefId'];
    }
    if (generatedMatch['branches']) {
      delete Object.assign(generatedMatch, {
        'order.branchId': generatedMatch['branches'],
      })['branches'];
    }

    const [result] = await this._model.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchant),
        },
      },
      {
        $lookup: {
          from: 'ratingscales',
          localField: 'rating',
          foreignField: '_id',
          as: 'rating',
        },
      },
      {
        $facet: {
          Ratings: [
            {
              $lookup: {
                from: 'orders',
                localField: 'order',
                foreignField: '_id',
                as: 'order',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'order.orderCreatedBy',
                foreignField: '_id',
                as: 'client',
              },
            },
            {
              $lookup: {
                from: 'branches',
                localField: 'order.branchId',
                foreignField: '_id',
                as: 'branch',
              },
            },
            {
              $lookup: {
                from: 'cities',
                localField: 'branch.cityId',
                foreignField: '_id',
                as: 'city',
              },
            },
            { $unwind: '$rating' },
            { $unwind: '$order' },
            { $unwind: '$client' },
            { $unwind: '$branch' },
            { $unwind: '$city' },
            {
              $project: {
                _id: 1,
                rating: 1,
                comment: 1,
                is_public: 1,
                extraNote: 1,
                merchant: 1,
                order: 1,
                client: 1,
                city: 1,
                createdAt: 1,
              },
            },
            {
              $match: generatedMatch,
            },
            {
              $skip: page <= 0 ? 0 : limit * page,
            },
            {
              $limit: limit,
            },
            {
              $group: {
                _id: '$merchant',
                avgOrdersRating: { $avg: { $ifNull: ['$rating.level', 0] } },
                ratings: {
                  $push: '$$ROOT',
                },
                order: { $first: '$order' },
                client: { $first: '$client' },
              },
            },
            {
              $project: {
                _id: 1,
                avgOrdersRating: { $round: ['$avgOrdersRating', 1] },
                ratings: {
                  _id: 1,
                  comment: 1,
                  is_public: 1,
                  rating: 1,
                  order: 1,
                  client: 1,
                  merchant: 1,
                  city: 1,
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            },
          ],
          ScaleOne: [
            {
              $match: {
                'rating.level': 1,
              },
            },
            {
              $count: 'count',
            },
          ],
          ScaleTwo: [
            {
              $match: {
                'rating.level': 2,
              },
            },
            {
              $count: 'count',
            },
          ],
          ScaleThree: [
            {
              $match: {
                'rating.level': 3,
              },
            },
            {
              $count: 'count',
            },
          ],
          ScaleFour: [
            {
              $match: {
                'rating.level': 4,
              },
            },
            {
              $count: 'count',
            },
          ],
          ScaleFive: [
            {
              $match: {
                'rating.level': 5,
              },
            },
            {
              $count: 'count',
            },
          ],
          TotalRatings: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$Ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleOne',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleTwo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleThree',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleFour',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$ScaleFive',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$TotalRatings',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const [total] = await this._model.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchant),
        },
      },
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
          ...generatedMatch,
        },
      },
      { $group: { _id: null, totalCount: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    const count = total?.totalCount || 0;

    const pagesCount = Math.ceil(count / limit) || 1;

    return { ...result, page: page, pages: pagesCount, length: count };
  }
}
