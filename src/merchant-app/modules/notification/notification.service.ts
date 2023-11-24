import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Client } from 'onesignal-node';

import { ERROR_CODES } from '../../../libs/utils/src';
import { MERCHANT_STATUS } from '../common/constants/merchant';
import { USER_TYPES } from '../common/constants/notification.constant';
import generateFilters from '../common/utils/generate-filters';
import {
  BranchRepository,
  MerchantEmployeeRepository,
  MerchantRepository,
  Notification,
  NotificationRepository,
  UserRepository,
} from '../models';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindAllNotificationQuery } from './dto/find-all-notification-query.dto';
import { SystemSentNotificationDto } from './dto/system-sent-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('MERCHANT_ONESIGNAL') private readonly merchantOneSignal: Client,
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository,
    private merchantRepository: MerchantRepository,
    private merchantEmployeeRepository: MerchantEmployeeRepository,
    private branchRepository: BranchRepository,
  ) {}

  public async systemSentNotifications(notification: SystemSentNotificationDto) {
    const {
      senderType = USER_TYPES.SYSTEM,
      useOneSignal = true,
      target,
      branch,
      merchant,
      notes,
      product,
      ...rest
    } = notification;

    const newNotification = new Notification();

    Object.assign(newNotification, {
      ...rest,
      target: new mongoose.Types.ObjectId(target),
      branch: branch ? new mongoose.Types.ObjectId(branch) : undefined,
      merchant: new mongoose.Types.ObjectId(merchant),
      senderType,
      useOneSignal,
      notes,
      product,
    });
    return this.notificationRepository.create(newNotification);
  }

  async findAll(user: any, query: FindAllNotificationQuery) {
    const { limit, page, paginate, sortBy, order, ...rest } = query;
    const generatedMatch = generateFilters(rest);

    if (user?.type === 'MerchantEmployee') {
      const branchesIds = (await this.merchantEmployeeRepository.getOne({ _id: user?._id }))?.branchesIds || [];
      Object.assign(generatedMatch, {
        branch: {
          $in: branchesIds || [],
        },
      });
    }

    if (user?.type === 'Owner') {
      if (user?.merchant?.status != MERCHANT_STATUS.APPROVED_STATUS) {
        const merchantId = await (
          await this.merchantRepository.getOne({ ownerId: new mongoose.Types.ObjectId(user?._id) })
        )?._id;
        Object.assign(generatedMatch, {
          merchant: {
            $eq: merchantId,
          },
        });
      } else {
        const branchesIds =
          (await this.branchRepository._model.find({ ownerId: user?._id }))?.map((ele) => {
            return ele._id;
          }) || [];
        Object.assign(generatedMatch, {
          branch: {
            $in: branchesIds || [],
          },
        });
      }
    }

    if (Object.getOwnPropertyDescriptor(generatedMatch, 'branches')) {
      delete Object.assign(generatedMatch, {
        branch: generatedMatch['branches'],
      })['branches'];
    }

    if (Object.getOwnPropertyDescriptor(generatedMatch, 'merchants')) {
      delete Object.assign(generatedMatch, {
        merchant: generatedMatch['merchants'],
      })['merchants'];
    }

    const notifications = await this.notificationRepository._model.aggregate([
      {
        $facet: {
          order: [
            {
              $match: { action: 'Order' },
            },
            {
              $lookup: {
                from: 'orders',
                let: { order_id: '$target' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$order_id'],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'orderCreatedBy',
                      foreignField: '_id',
                      as: 'orderCreatedBy',
                    },
                  },
                  { $unwind: '$orderCreatedBy' },
                ],
                as: 'target',
              },
            },
            { $unwind: '$target' },
          ],
          rating: [
            {
              $match: { action: 'Rating' },
            },
            {
              $lookup: {
                from: 'ratings',
                localField: 'target',
                foreignField: '_id',
                as: 'target',
              },
            },
            { $unwind: '$target' },
          ],
          review: [
            {
              $match: { action: 'Review' },
            },
            {
              $lookup: {
                from: 'reviews',
                localField: 'target',
                foreignField: '_id',
                as: 'target',
              },
            },
            {
              $unwind: {
                path: '$target',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $project: {
          result: {
            $setUnion: ['$order', '$rating', '$review'],
          },
        },
      },
      { $unwind: '$result' },
      { $replaceRoot: { newRoot: '$result' } },
      {
        $project: {
          _id: 1,
          senderType: 1,
          receiver: 1,
          action: 1,
          target: 1,
          branch: 1,
          merchant: 1,
          platform: 1,
          content: 1,
          title: 1,
          oneSignalId: 1,
          oneSignalFilters: 1,
          useOneSignal: 1,
          notes: 1,
          product: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $match: generatedMatch },
      { $sort: !sortBy ? { createdAt: -1 } : { [sortBy]: -1 } },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    const count = await this.notificationRepository._model.countDocuments(generatedMatch);

    const pagesCount = Math.ceil(count / limit) || 1;

    return { notifications, page: page, pages: pagesCount, length: count };
  }

  async shoppexNotification(user: any, createNotificationDto: CreateNotificationDto) {
    let audience;
    if (createNotificationDto.receiver) {
      audience = await this.userRepository._model.aggregate([
        {
          $match: {
            _id: {
              $in: createNotificationDto.receiver.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            uuid: 1,
            job: 1,
          },
        },
      ]);
    }
    if (createNotificationDto.branch) {
      audience = await this.userRepository._model.aggregate([
        {
          $match: {
            branchesIds: {
              $eq: new mongoose.Types.ObjectId(createNotificationDto.branch),
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            uuid: 1,
            job: 1,
          },
        },
      ]);
    }
    if (createNotificationDto.merchant) {
      audience = await this.userRepository._model.aggregate([
        {
          $match: {
            merchantId: {
              $eq: new mongoose.Types.ObjectId(createNotificationDto.merchant),
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            uuid: 1,
            job: 1,
          },
        },
      ]);
    }
    const notification = {
      include_player_ids: audience.map((el) => el.uuid),
      contents: createNotificationDto.content,
      headings: createNotificationDto.title,
      subtitle: createNotificationDto.subtitle,
      // filters: createNotificationDto.oneSignalFilters
      location: {
        radius: createNotificationDto.radius,
        lat: createNotificationDto.latitude,
        long: createNotificationDto.longitude,
      },
    };
    const notified = await this.merchantOneSignal.createNotification(notification);

    if (notified.statusCode === 200 && notified.body?.recipients >= 1) {
      const newNotification = new Notification();
      newNotification.sender = new mongoose.Types.ObjectId(user._id);
      newNotification.senderType = 'ShoppexEmployee';
      newNotification.receiver = audience.map((el) => new mongoose.Types.ObjectId(el._id));
      newNotification.oneSignalId = notified.body.id;
      newNotification.useOneSignal = true;
      newNotification.oneSignalFilters = createNotificationDto.oneSignalFilters;
      newNotification.coordinates = {
        type: 'Point',
        coordinates: [createNotificationDto.longitude, createNotificationDto.latitude],
      };
      newNotification.radius = createNotificationDto.radius;
      newNotification.title = createNotificationDto.title;
      newNotification.content = createNotificationDto.content;
      newNotification.merchant = new mongoose.Types.ObjectId(createNotificationDto.merchant);
      newNotification.branch = new mongoose.Types.ObjectId(createNotificationDto.branch);
      newNotification.notes = createNotificationDto.notes;

      await this.notificationRepository.create(newNotification);

      return { success: true };
    } else {
      throw new BadRequestException(ERROR_CODES.err_failed_to_send_notification);
    }
  }
}
