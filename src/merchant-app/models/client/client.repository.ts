import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Client } from '../../../libs/database/src/lib/models/client/client.schema';
import { ClientOwnerTypesDetailsEnum } from '../../modules/common/constants/client.owner.types.details';
import generateFilters from '../../modules/common/utils/generate-filters';
import generatePagination from '../../modules/common/utils/generate-pagination';
import { ClientFiltersQuery } from '../../modules/dashboard/dto/client-filters.dto';
import { MerchantFiltersClientQuery } from '../../modules/dashboard/dto/merchant-filter-client.dto';
import { BaseRepository } from '../BaseRepository';
import {
  ORDER_ACCEPTED_STATUS,
  ORDER_IN_PROGRESS_STATUS,
  ORDER_READY_STATUS,
} from './../../modules/common/constants/order.constants';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(
    @InjectModel('Client')
    private readonly nModel: mongoose.Model<Client>,
  ) {
    super(nModel);
  }

  async create(data): Promise<Client> {
    const document = new this.nModel.prototype.constructor(data);
    const client = await document.save();

    return client.toObject();
  }

  async getOne(query: any): Promise<Client> {
    return this.nModel.findOne(query).lean();
  }

  async updateOne(query, data): Promise<Client> {
    return this.nModel.findOneAndUpdate(query, data, { new: true }).select({ password: 0 }).lean();
  }

  async getClientDetailsById(client_id: string) {
    return this.nModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(client_id),
          type: ClientOwnerTypesDetailsEnum.CLIENT,
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city',
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'clientId',
          as: 'orders',
        },
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$county',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          balance: { $first: '$balance' },
          cityId: { $first: '$cityId' },
          mobile: { $first: '$mobile' },
          dateOfBirth: { $first: '$dateOfBirth' },
          imageUrl: { $first: '$imageUrl' },
          countryId: { $first: '$countryId' },
          status: { $first: '$status' },
          country: { $first: '$country' },
          city: { $first: '$city' },
          orders: { $first: '$orders' },
          emailIsVerified: { $first: '$emailIsVerified' },
          mobileIsVerified: { $first: '$mobileIsVerified' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          gender: { $first: '$gender' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          balance: 1,
          email: 1,
          cityId: 1,
          mobile: 1,
          dateOfBirth: 1,
          imageUrl: 1,
          countryId: 1,
          status: 1,
          country: 1,
          city: 1,
          total_orders_count: { $size: '$orders' },
          emailIsVerified: 1,
          mobileIsVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          gender: 1,
        },
      },
    ]);
  }

  async getForDashboard(filters: ClientFiltersQuery) {
    const { limit = 25, page = 1, paginate = true, ...restFilters } = filters || {};
    const generatedMatch = generateFilters(restFilters);

    if (generatedMatch['cities']) {
      delete Object.assign(generatedMatch, {
        cityId: generatedMatch['cities'],
      })['cities'];
    }

    const pipeline = [
      { $match: generatedMatch },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId',
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countryId',
          foreignField: '_id',
          as: 'countryId',
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { localField: '$_id' },
          as: 'activeOrder',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$$localField', '$clientId'] },
                    {
                      $in: ['$status', [ORDER_ACCEPTED_STATUS, ORDER_READY_STATUS, ORDER_IN_PROGRESS_STATUS]],
                    },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $limit: 1,
            },
            {
              $project: {
                _id: 1,
                status: 1,
                items: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$cityId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$countryId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobile: 1,
          email: 1,
          balance: 1,
          uuid: 1,
          gender: 1,
          address: 1,
          activeOrder: 1,
          emailIsVerified: 1,
          mobileIsVerified: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const result = await this.aggregate(pipeline, {
      page,
      limit,
      sort: {},
      paginate,
    });
    return result;
  }

  async getClientsForMerchant(filters: MerchantFiltersClientQuery) {
    const { limit = 25, page = 1, paginate = true, ...restFilters } = filters || {};
    const generatedMatch = generateFilters(restFilters);

    // if (generatedMatch['cities']) {
    //   delete Object.assign(generatedMatch, {
    //     cityId: generatedMatch['cities'],
    //   })['cities'];
    // }

    const pipeline = [
      { $match: generatedMatch },
      {
        $project: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobile: 1,
          email: 1,
          gender: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const result = await this.aggregate(pipeline, {
      page,
      limit,
      sort: {},
      paginate,
    });
    return result;
  }

  async dashboardClientsStatistics() {
    const result = await this.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  '$createdAt',
                  {
                    $dateSubtract: {
                      startDate: '$$NOW',
                      unit: 'month',
                      amount: 6,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $literal: 1 },
        },
      },
      {
        $group: {
          _id: '$createdAt',
          createdAt: { $first: '$createdAt' },
          count: { $first: '$count' },
        },
      },
    ]);

    const response = result?.users?.sort((a, b) => Date.parse(a?.createdAt) - Date.parse(b?.createdAt));

    return response;
  }
}
