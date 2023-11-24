import { Address } from '../../../libs/database/src/lib/models/address/address.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { BaseRepository } from '../BaseRepository';

@Injectable()
export class AddressRepository extends BaseRepository<Address> {
  constructor(@InjectModel(Address.name) private readonly nModel: Model<Address>) {
    super(nModel);
  }

  // async dashboardFindAllClientsByBranchId(branch: Branch) {
  //   const results = await this._model.aggregate([
  //     {
  //       $geoNear: {
  //         near: {
  //           type: 'Point',
  //           coordinates: [branch.location.coordinates[0], branch.location.coordinates[1]],
  //         },
  //         query: { active: true },
  //         spherical: true,
  //         distanceField: 'distance',
  //         distanceMultiplier: 0.001
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         as: 'customer',
  //         let: { clientId: '$client' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$_id', '$$clientId'] }, { $eq: ['$type', 'Client'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$customer',
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         as: 'orders',
  //         let: { clientId: '$client' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$clientId', '$$clientId'] },
  //                   { $eq: ['$branchId', branch._id] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $match: {
  //         orders: { $ne: [] },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: '$customer._id',
  //         name: '$customer.name',
  //         countryCode: '$customer.countryCode',
  //         mobile: '$customer.mobile',
  //         email: '$customer.email',
  //         location: 1,
  //         distance: { $round: ['$distance', 2] },
  //       },
  //     },
  //     {
  //       $bucket: {
  //         groupBy: '$distance',
  //         boundaries: [0, 5, 10, 20, 50, 100, 500],
  //         default: 'greater than 500km',
  //         output: {
  //           count: { $sum: 1 },
  //           customers: { $push: '$$ROOT' },
  //         },
  //       },
  //     },
  //   ]);
  //   console.log('results=', results);
  //   return results;
  // }

  async listAddresses(clientId: any) {
    const client = new Types.ObjectId(clientId);
    try {
      return this.nModel.aggregate([
        {
          $match: {
            client,
            isDeleted: false,
          },
        },
      ]);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
