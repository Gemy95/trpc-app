// import { Injectable } from '../../dashboard/dto/owner-filters.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Driver } from '../../../libs/database/src/lib/models/driver/driver.schema';
import generateFilters from '../../modules/common/utils/generate-filters';
// import { DriverFiltersQuery } from '../../modules/dashboard/dto/driver-filters.dto';
// import generateFilters from '../../common/utils/generate-filters';
import { BaseRepository } from '../BaseRepository';
import { SettingRepository } from '../setting/setting.repository';

@Injectable()
export class DriverRepository extends BaseRepository<Driver> {
  constructor(
    @InjectModel('Driver')
    private readonly nModel: Model<Driver>,
    private settingRepository: SettingRepository,
  ) {
    super(nModel);
  }

  // async create(data): Promise<Driver> {
  //   const document = new this.nModel.prototype.constructor(data);
  //   const owner = await document.save();

  //   return owner.toObject();
  // }

  // async updateOne(query, data): Promise<Driver> {
  //   return this.nModel
  //     .findOneAndUpdate(query, data, { new: true, populate: ['cityId', 'countryId'] })
  //     .select({ password: 0 })
  //     .lean();
  // }

  // async getDriverDetailsById(driverId: string) {
  //   return this.nModel.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(driverId),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'countries',
  //         localField: 'countryId',
  //         foreignField: '_id',
  //         as: 'country',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'cities',
  //         localField: 'cityId',
  //         foreignField: '_id',
  //         as: 'city',
  //       },
  //     },
  //     // {
  //     //   $lookup: {
  //     //     from: 'merchants',
  //     //     localField: '_id',
  //     //     foreignField: 'ownerId',
  //     //     as: 'merchant',
  //     //   },
  //     // },
  //     {
  //       $unwind: {
  //         path: '$country',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$city',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     // {
  //     //   $unwind: {
  //     //     path: '$merchant',
  //     //     preserveNullAndEmptyArrays: true,
  //     //   },
  //     // },
  //     {
  //       $group: {
  //         _id: '$_id',
  //         name: { $first: '$name' },
  //         email: { $first: '$email' },
  //         cityId: { $first: '$cityId' },
  //         mobile: { $first: '$mobile' },
  //         dateOfBirth: { $first: '$dateOfBirth' },
  //         countryId: { $first: '$countryId' },
  //         status: { $first: '$status' },
  //         country: { $first: '$country' },
  //         city: { $first: '$city' },
  //         // merchant: { $first: '$merchant' },
  //         emailIsVerified: { $first: '$emailIsVerified' },
  //         mobileIsVerified: { $first: '$mobileIsVerified' },
  //         createdAt: { $first: '$createdAt' },
  //         updatedAt: { $first: '$updatedAt' },
  //         gender: { $first: '$gender' },
  //         isDeleted: { $first: '$isDeleted' },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         email: 1,
  //         cityId: 1,
  //         mobile: 1,
  //         dateOfBirth: 1,
  //         countryId: 1,
  //         status: 1,
  //         country: 1,
  //         city: 1,
  //         // merchant: 1,
  //         emailIsVerified: 1,
  //         mobileIsVerified: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         gender: 1,
  //         isDeleted: 1,
  //       },
  //     },
  //   ]);
  // }

  // async getForDashboard(filters: DriverFiltersQuery) {
  //   const { limit = 25, page = 1, paginate = true, ...restFilters } = filters;
  //   const generatedMatch = generateFilters(restFilters);

  //   if (generatedMatch['cities']) {
  //     delete Object.assign(generatedMatch, {
  //       cityId: generatedMatch['cities'],
  //     })['cities'];
  //   }

  //   const pipeline = [
  //     { $match: generatedMatch },
  //     {
  //       $lookup: {
  //         from: 'cities',
  //         localField: 'cityId',
  //         foreignField: '_id',
  //         as: 'cityId',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'countries',
  //         localField: 'countryId',
  //         foreignField: '_id',
  //         as: 'countryId',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$cityId',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$countryId',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         role: 0,
  //         password: 0,
  //       },
  //     },
  //   ];

  //   const result = this.aggregate(pipeline, { page, limit, sort: {}, paginate });
  //   return result;
  // }

  // login(countryCode: string, mobile: string) {
  //   return this._model.aggregate([
  //     {
  //       $match: {
  //         mobile,
  //         countryCode,
  //       },
  //     },
  //     // {
  //     //   $lookup: {
  //     //     from: 'merchants',
  //     //     as: 'merchant',
  //     //     let: { ownerField: '$_id' },
  //     //     pipeline: [
  //     //       {
  //     //         $match: {
  //     //           $expr: {
  //     //             $and: [{ $eq: ['$ownerId', '$$ownerField'] }, { $eq: ['$isDeleted', false] }],
  //     //           },
  //     //         },
  //     //       },
  //     //       {
  //     //         $lookup: {
  //     //           from: 'cities',
  //     //           as: 'city',
  //     //           let: { cityField: '$cityId' },
  //     //           pipeline: [
  //     //             {
  //     //               $match: {
  //     //                 $expr: {
  //     //                   $and: [{ $eq: ['$_id', '$$cityField'] }],
  //     //                 },
  //     //               },
  //     //             },
  //     //             {
  //     //               $lookup: {
  //     //                 from: 'countries',
  //     //                 localField: 'country',
  //     //                 foreignField: '_id',
  //     //                 as: 'countryId',
  //     //               },
  //     //             },
  //     //             {
  //     //               $unwind: {
  //     //                 path: "$countryId",
  //     //                 preserveNullAndEmptyArrays: true
  //     //               }
  //     //             }
  //     //           ],
  //     //         },
  //     //       },
  //     //       {
  //     //         $unwind: {
  //     //           path: "$city",
  //     //           preserveNullAndEmptyArrays: true
  //     //         }
  //     //       }
  //     //     ],
  //     //   },
  //     // },
  //     // {
  //     //   $lookup: {
  //     //     from: 'branches',
  //     //     as: 'branches',
  //     //     let: { merchantField: '$merchant._id' },
  //     //     pipeline: [
  //     //       {
  //     //         $match: {
  //     //           $expr: {
  //     //             $and: [{ $in: ['$merchantId', '$$merchantField'] }, { $eq: ['$isDeleted', false] }],
  //     //           },
  //     //         },
  //     //       },
  //     //     ],
  //     //   },
  //     // },
  //     {
  //       $lookup: {
  //         from: 'countries',
  //         localField: 'countryId',
  //         foreignField: '_id',
  //         as: 'country',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'cities',
  //         localField: 'cityId',
  //         foreignField: '_id',
  //         as: 'city',
  //       },
  //     },
  //     // {
  //     //   $lookup: {
  //     //     from: 'users',
  //     //     as: 'merchantEmployees',
  //     //     let: { merchantField: '$merchant._id' },
  //     //     pipeline: [
  //     //       {
  //     //         $match: {
  //     //           $expr: {
  //     //             $and: [
  //     //               { $in: ['$merchantId', '$$merchantField'] },
  //     //               { $eq: ['$type', 'MerchantEmployee'] },
  //     //               { $eq: ['$isDeleted', false] },
  //     //             ],
  //     //           },
  //     //         },
  //     //       },
  //     //     ],
  //     //   },
  //     // },
  //     // {
  //     //   $lookup: {
  //     //     from: 'orders',
  //     //     as: 'orders',
  //     //     let: { branchesField: '$branches._id' },
  //     //     pipeline: [
  //     //       {
  //     //         $match: {
  //     //           $expr: {
  //     //             $and: [{ $in: ['$branchId', '$$branchesField'] }],
  //     //           },
  //     //         },
  //     //       },
  //     //     ],
  //     //   },
  //     // },
  //     // {
  //     //   $unwind: {
  //     //     path: '$merchant',
  //     //     preserveNullAndEmptyArrays: true,
  //     //   },
  //     // },
  //     {
  //       $unwind: {
  //         path: '$country',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$city',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'banks',
  //         let: { bankId: '$merchant.bankAccount.bank' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$_id', '$$bankId'] }],
  //               },
  //             },
  //           },
  //         ],
  //         as: 'bank',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$bank',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         countryCode: 1,
  //         mobile: 1,
  //         email: 1,
  //         password: 1,
  //         country: 1,
  //         city: 1,
  //         uuid: 1,
  //         mobileIsVerified: 1,
  //         emailIsVerified: 1,
  //         type: 1,
  //         status: 1,
  //         gender: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         dateOfBirth: 1,
  //         role: 1,
  //         isDeleted: 1,
  //         deletedAt: 1,
  //         isPasswordReset: { $literal: true },
  //         // merchant: {
  //         //   _id: 1,
  //         //   name: 1,
  //         //   description: 1,
  //         //   commercialRegistrationNumber: 1,
  //         //   commercialName: 1,
  //         //   branchesNumber: 1,
  //         //   hasDeliveryService: 1,
  //         //   address: 1,
  //         //   uuid: 1,
  //         //   status: 1,
  //         //   status_tags: 1,
  //         //   visibility_status: 1,
  //         //   ownerId: 1,
  //         //   logo: 1,
  //         //   identificationImage: 1,
  //         //   commercialIdImage: 1,
  //         //   balance: 1,
  //         //   location: 1,
  //         //   locationDelta: 1,
  //         //   notes: 1,
  //         //   isDeleted: 1,
  //         //   translation: 1,
  //         //   categoriesIds: 1,
  //         //   tagsIds: 1,
  //         //   cityId: 1,
  //         //   productsPriceRange: 1,
  //         //   twitterUrl: 1,
  //         //   facebookUrl: 1,
  //         //   websiteUrl: 1,
  //         //   snapUrl: 1,
  //         //   tiktokUrl: 1,
  //         //   mobile: 1,
  //         //   approvedBy: 1,
  //         //   inReview: 1,
  //         //   createdAt: 1,
  //         //   updatedAt: 1,
  //         //   rating: 1,
  //         //   isLiked: 1,
  //         //   'bankAccount._id': 1,
  //         //   'bankAccount.bank':  { $ifNull: [ "$bank", {} ] },
  //         //   'bankAccount.nameOfPerson': 1,
  //         //   'bankAccount.accountNumber': 1,
  //         //   'bankAccount.iban': 1,
  //         //   'bankAccount.accountType': 1,
  //         //   'bankAccount.accountImageUrl': 1,
  //         //   'bankAccount.createdAt': 1,
  //         //   'bankAccount.updatedAt': 1,
  //         //   subscriptions: 1,
  //         //   city: 1,
  //         //   lowestPriceToOrder: 1,
  //         //   minimum_delivery_price: 1,
  //         //   status_before_deleted: 1,
  //         //   deletedAt: 1,
  //         // },
  //         // 'merchant.country': { $ifNull: [ "$merchant.city.countryId", {} ] },
  //         // branches: 1,
  //         // totalMerchantEmployeesCount: { $size: { $ifNull: ['$merchantEmployees', []] } },
  //         // totalOrdersCount: { $size: { $ifNull: ['$orders', []] } },
  //       },
  //     },
  //     { $limit: 1 },
  //   ]);
  // }

  async getNearestDriver(longitude: number, latitude: number) {
    const distance = await this.settingRepository.getOne({
      modelName: 'OrderRadius',
    });
    const maxDistance = distance?.maxDistance || 4000;

    const [driver] = await this.nModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'dist.calculated',
          maxDistance: maxDistance,
          // query: {
          //   status: DRIVER_STATUS.APPROVED_STATUS,
          // },
          includeLocs: 'dist.location',
          spherical: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          location: { $first: '$location' },
          deliveryProviderId: { $first: '$deliveryProviderId' },
          dist: { $first: '$dist' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          deliveryProviderId: 1,
          dist: 1,
        },
      },
      {
        $sort: { 'dist.calculated': 1 },
      },
      { $limit: 1 },
    ]);

    return driver;
  }
}
