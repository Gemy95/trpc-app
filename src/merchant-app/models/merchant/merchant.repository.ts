import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';

// import { Merchant } from '../../merchant/dto/dashboard-merchant-statistics.dto';
// import { MenuUploadFilterDto } from '../../menu-upload/dto/menu-upload-filter.dto';
import { Merchant } from '../../../libs/database/src/lib/models/merchant/merchant.schema';
import ERROR_CODES from '../../../libs/utils/src/lib/errors_codes';
// import { BRANCH_STATUS } from '../../merchant/dto/merchant-statistics.dto';
import { BRANCH_STATUS } from '../../modules/common/constants/branch.constants';
import {
  OFFLINE_STATUS as MERCHANT_OFFLINE_STATUS,
  ONLINE_STATUS as MERCHANT_ONLINE_STATUS,
  MERCHANT_STATUS,
} from '../../modules/common/constants/merchant';
import { FindAllMerchantType } from '../../modules/common/types/merchant.types';
import generateCustomSearch from '../../modules/common/utils/build-custom-search-query';
import generateFilters from '../../modules/common/utils/generate-filters';
import generatePagination from '../../modules/common/utils/generate-pagination';
// import { BaseRepository } from '../../merchant/dto/merchant-query.dto';
// import { SearchDto } from '../../search/dto/search-merchant.dto';
import { BaseRepository } from '../BaseRepository';
import {
  ORDER_EXPIRED_STATUS,
  ORDER_PENDING_STATUS,
  ORDER_STATUS,
} from './../../modules/common/constants/order.constants';

@Injectable()
export class MerchantRepository extends BaseRepository<Merchant> {
  constructor(
    @InjectModel('Merchant')
    private readonly nModel: Model<Merchant>,
  ) {
    super(nModel);
  }

  // async create(data): Promise<Merchant> {
  //   const document = new this.nModel.prototype.constructor(data);
  //   const merchant = await document.save();

  //   return merchant.toObject();
  // }

  // async getOne(query, params?): Promise<Merchant> {
  //   const q = this._buildQuery(this.nModel.findOne(query || {}), params);
  //   return q.exec();
  // }

  // async updateOne(query, data): Promise<Merchant> {
  //   return this.nModel
  //     .findOneAndUpdate(query, data, { new: true })
  //     .select({ password: 0 })
  //     .lean();
  // }

  // async getMerchantDetailsById(merchantId: string) {
  //   return this.nModel.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(merchantId),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'ownerId',
  //         foreignField: '_id',
  //         as: 'owner',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         let: { localFieldMerchantId: '$_id' },
  //         as: 'merchantEmployees',
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   { $eq: ['$isDeleted', false] },
  //                   { $eq: ['$type', 'MerchantEmployee'] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
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
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'categoriesIds',
  //         foreignField: '_id',
  //         as: 'categories',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'tags',
  //         localField: 'tagsIds',
  //         foreignField: '_id',
  //         as: 'tags',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         localField: '_id',
  //         foreignField: 'merchantId',
  //         as: 'branches',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         localField: '_id',
  //         foreignField: 'merchantId',
  //         as: 'products',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'productgroups',
  //         localField: '_id',
  //         foreignField: 'merchantId',
  //         as: 'productgroups',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'productcategories',
  //         localField: 'branches._id',
  //         foreignField: 'branches',
  //         as: 'productcategories',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         localField: 'branches._id',
  //         foreignField: 'branchId',
  //         as: 'orders',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         as: 'active_orders',
  //         let: { branchId: '$branches._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $in: ['$branchId', '$$branchId'] },
  //                   { $eq: ['$status', ORDER_PENDING_STATUS] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         commercialRegistrationNumber: 1,
  //         commercialName: 1,
  //         branchesNumber: 1,
  //         hasDeliveryService: 1,
  //         address: 1,
  //         uuid: 1,
  //         status: 1,
  //         status_tags: 1,
  //         visibility_status: 1,
  //         logo: 1,
  //         identificationImage: 1,
  //         commercialIdImage: 1,
  //         balance: 1,
  //         location: 1,
  //         locationDelta: 1,
  //         notes: 1,
  //         ownerId: 1,
  //         cityId: 1,
  //         categoriesIds: 1,
  //         tagsIds: 1,
  //         owner: 1,
  //         merchantEmployees: 1,
  //         city: 1,
  //         orders: 1,
  //         categories: 1,
  //         tags: 1,
  //         lowestPriceToOrder: 1,
  //         minimum_delivery_price: 1,
  //         isDeleted: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         total_orders_count: { $size: '$orders' },
  //         total_active_orders_count: { $size: '$active_orders' },
  //         total_product_groups_count: { $size: '$productgroups' },
  //         total_product_categories_count: { $size: '$productcategories' },
  //         total_client_branches_visits_count: {
  //           $sum: '$branches.client_visits',
  //         },
  //         total_merchant_employees_count: { $size: '$merchantEmployees' },
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$owner',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$city',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //   ]);
  // }

  // async getAllMerchantsWithFilter(
  //   query: MerchantQueryDto,
  // ): Promise<FindAllMerchantType> {
  //   const { limit = 25, page = 0, search, ...rest } = query;
  //   const generatedMatch = generateFilters(rest);
  //   const generatedSearch = generateCustomSearch(search, [
  //     'name',
  //     'translation.name',
  //     'owner.mobile',
  //     'owner.email',
  //     'status',
  //     'status_tags',
  //     'visibility_status',
  //   ]);

  //   const pagination = generatePagination(limit, page);

  //   if (generatedMatch['cities']) {
  //     delete Object.assign(generatedMatch, {
  //       'city._id': generatedMatch['cities'],
  //     })['cities'];
  //   }

  //   if (generatedMatch['categories']) {
  //     delete Object.assign(generatedMatch, {
  //       'categories._id': generatedMatch['categories'],
  //     })['categories'];
  //   }

  //   if (generatedMatch['tags']) {
  //     delete Object.assign(generatedMatch, {
  //       'tags._id': generatedMatch['tags'],
  //     })['tags'];
  //   }

  //   if (generatedMatch['ownerMobile']) {
  //     delete Object.assign(generatedMatch, {
  //       'owner.mobile': generatedMatch['ownerMobile'],
  //     })['ownerMobile'];
  //   }

  //   if (generatedMatch['ownerEmail']) {
  //     delete Object.assign(generatedMatch, {
  //       'owner.email': generatedMatch['ownerEmail'],
  //     })['ownerEmail'];
  //   }

  //   const [result] = await this.nModel.aggregate([
  //     {
  //       $facet: {
  //         Merchants: [
  //           {
  //             $lookup: {
  //               from: 'categories',
  //               localField: 'categoriesIds',
  //               foreignField: '_id',
  //               as: 'categories',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'users',
  //               localField: 'ownerId',
  //               foreignField: '_id',
  //               as: 'owner',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'tags',
  //               localField: 'tagsIds',
  //               foreignField: '_id',
  //               as: 'tags',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'cities',
  //               localField: 'cityId',
  //               foreignField: '_id',
  //               as: 'city',
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generatedSearch,
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$owner',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generatedMatch,
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$city',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           {
  //             $project: {
  //               _id: 1,
  //               name: 1,
  //               identificationImage: 1,
  //               commercialRegistrationNumber: 1,
  //               commercialName: 1,
  //               commercialImage: 1,
  //               branchesNumber: 1,
  //               hasDeliveryService: 1,
  //               address: 1,
  //               uuid: 1,
  //               status: 1,
  //               status_tags: 1,
  //               visibility_status: 1,
  //               logo: 1,
  //               balance: 1,
  //               location: 1,
  //               locationDelta: 1,
  //               translation: 1,
  //               merchantId: 1,
  //               createdAt: 1,
  //               updatedAt: 1,
  //               hasDeliverService: 1,
  //               visableToClients: 1,
  //               notes: 1,
  //               owner: 1,
  //               categories: 1,
  //               tags: 1,
  //               city: 1,
  //               bankAccount: 1,
  //               lowestPriceToOrder: 1,
  //               minimum_delivery_price: 1,
  //             },
  //           },
  //           {
  //             $skip: page <= 0 ? 0 : limit * page,
  //           },
  //           {
  //             $limit: limit,
  //           },
  //         ],
  //         Rejected: [
  //           {
  //             $match: { status: MERCHANT_STATUS.REJECTED_STATUS },
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //           { $project: { _id: 0, count: 1 } },
  //         ],
  //         Approved: [
  //           {
  //             $match: { status: MERCHANT_STATUS.APPROVED_STATUS },
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //           { $project: { _id: 0, count: 1 } },
  //         ],
  //         Pending: [
  //           {
  //             $match: { status: MERCHANT_STATUS.PENDING_STATUS },
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //           { $project: { _id: 0, count: 1 } },
  //         ],
  //         Total: [
  //           {
  //             $match: generatedMatch,
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //           { $project: { _id: 0, count: 1 } },
  //         ],
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$Rejected',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$Approved',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$Pending',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$Total',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //   ]);

  //   return {
  //     merchants: result?.Merchants,
  //     page: page || 0,
  //     pages: Math.ceil(result?.Total?.count / limit) || 1,
  //     length: result?.Total?.count,
  //     rejected: result?.Rejected?.count || 0,
  //     approved: result?.Approved?.count || 0,
  //     pending: result?.Pending?.count || 0,
  //   };
  // }

  // async searchMerchants(query: SearchDto) {
  //   const { search, ...rest } = query;

  //   const generatedMatch = generateFilters(rest);
  //   const generatedSearch = generateFilters({ search });

  //   return this.nModel.aggregate([
  //     {
  //       $match: {
  //         status: MERCHANT_STATUS.APPROVED_STATUS,
  //         // visibility_status: {
  //         //   $in: [MERCHANT_ONLINE_STATUS, MERCHANT_OFFLINE_STATUS],
  //         // },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         localField: '_id',
  //         foreignField: 'merchantId',
  //         as: 'branches',
  //       },
  //     },
  //     {
  //       $match: {
  //         ...generatedMatch,
  //         ...generatedSearch,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         commercialRegistrationNumber: 1,
  //         commercialName: 1,
  //         branchesNumber: 1,
  //         hasDeliveryService: 1,
  //         address: 1,
  //         uuid: 1,
  //         status: 1,
  //         status_tags: 1,
  //         visibility_status: 1,
  //         logo: 1,
  //         identificationImage: 1,
  //         commercialIdImage: 1,
  //         balance: 1,
  //         location: 1,
  //         locationDelta: 1,
  //         notes: 1,
  //         ownerId: 1,
  //         cityId: 1,
  //         categoriesIds: 1,
  //         tagsIds: 1,
  //         city: 1,
  //         categories: 1,
  //         tags: 1,
  //         isDeleted: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         branches: 1,
  //         bankAccount: 1,
  //         lowestPriceToOrder: 1,
  //         minimum_delivery_price: 1,
  //       },
  //     },
  //   ]);
  // }

  // async getMerchantStatisticsById(
  //   merchantId,
  //   params: FindMerchantStatisticsDto,
  // ) {
  //   const { ...rest } = params;
  //   const generatedMatch = generateFilters(rest);
  //   let generateMatchBranches = {};
  //   let generateMatchOrders = {};

  //   if (generatedMatch['branches']) {
  //     generateMatchBranches = { _id: generatedMatch?.['branches'] };
  //     delete generatedMatch?.['branches'];
  //   }

  //   if (generatedMatch['createdAt']) {
  //     generateMatchOrders = { createdAt: generatedMatch['createdAt'] };
  //     delete generatedMatch['createdAt'];
  //   }

  //   const result = await this.nModel.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(merchantId),
  //         isDeleted: false,
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
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'categoriesIds',
  //         foreignField: '_id',
  //         as: 'categories',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'tags',
  //         localField: 'tagsIds',
  //         foreignField: '_id',
  //         as: 'tags',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         let: { localFieldMerchantId: '$_id' },
  //         as: 'merchantEmployees',
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   { $eq: ['$type', 'MerchantEmployee'] },
  //                   { $eq: ['$isDeleted', false] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $match: generateMatchBranches?.['_id']
  //               ? {
  //                   branchesIds: generateMatchBranches?.['_id'],
  //                 }
  //               : {},
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         as: 'products',
  //         let: {
  //           localFieldMerchantId: '$_id',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   { $eq: ['$isDeleted', false] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $match: generateMatchBranches?.['_id']
  //               ? {
  //                   branchesIds: generateMatchBranches?.['_id'],
  //                 }
  //               : {},
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         let: { localFieldMerchantId: '$_id' },
  //         as: 'branches',
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   { $eq: ['$isDeleted', false] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchBranches,
  //             },
  //           },
  //           // {
  //           //   $lookup: {
  //           //     from: 'products',
  //           //     as: 'products',
  //           //     let: {
  //           //       localBranchId: '$_id',
  //           //     },
  //           //     pipeline: [
  //           //       {
  //           //         $match: {
  //           //           $expr: {
  //           //             $and: [
  //           //               { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //           //               [{ $in: ['$$localBranchId', '$branchesIds'] }],
  //           //               { $eq: ['$isDeleted', false] },
  //           //             ],
  //           //           },
  //           //         },
  //           //       },
  //           //     ],
  //           //   },
  //           // },
  //           // {
  //           //   $lookup: {
  //           //     from: 'users',
  //           //     let: { localBrancheId: '$_id' },
  //           //     as: 'merchantEmployees',
  //           //     pipeline: [
  //           //       {
  //           //         $match: {
  //           //           $expr: {
  //           //             $and: [
  //           //               { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //           //               { $in: ['$$localBrancheId', '$branchesIds'] },
  //           //               { $eq: ['$type', 'MerchantEmployee'] },
  //           //               { $eq: ['$isDeleted', false] },
  //           //             ],
  //           //           },
  //           //         },
  //           //       },
  //           //     ],
  //           //   },
  //           // },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'reservations',
  //         localField: 'branches._id',
  //         foreignField: 'branch',
  //         as: 'reservations',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'productgroups',
  //         localField: '_id',
  //         foreignField: 'merchantId',
  //         as: 'productgroups',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'productcategories',
  //         localField: 'branches._id',
  //         foreignField: 'branches',
  //         as: 'productcategories',
  //       },
  //     },
  //     // {
  //     //   $lookup: {
  //     //     from: 'orders',
  //     //     localField: 'branches._id',
  //     //     foreignField: 'branchId',
  //     //     as: 'orders',
  //     //   },
  //     // },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         let: { localFieldBranchId: '$branches._id' },
  //         as: 'acceptedOrders',
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $in: ['$branchId', '$$localFieldBranchId'] },
  //                   { $eq: ['$status', ORDER_STATUS.ORDER_DELIVERED_STATUS] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchOrders,
  //             },
  //           },
  //           {
  //             $project: {
  //               _id: 1,
  //               invoice: 1,
  //               // createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
  //               createdAt: 1,
  //             },
  //           },
  //           {
  //             $sort: {
  //               createdAt: -1,
  //             },
  //           },
  //           {
  //             $group: {
  //               _id: '$createdAt',
  //               sum: {
  //                 $sum: {
  //                   $toDouble: '$invoice.total',
  //                 },
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         let: { localFieldBranchId: '$branches._id' },
  //         as: 'orders',
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $in: ['$branchId', '$$localFieldBranchId'] }],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchOrders,
  //             },
  //           },
  //           {
  //             $sort: {
  //               createdAt: 1,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $addFields: {
  //         ordersProductsItems: {
  //           $reduce: {
  //             input: '$orders.items',
  //             initialValue: [],
  //             in: { $concatArrays: ['$$value', '$$this'] },
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         as: 'productsIntoOrders',
  //         let: {
  //           localFieldProductsIds: '$ordersProductsItems.productId',
  //           localFieldProductsCounts: '$ordersProductsItems.count',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $in: ['$_id', '$$localFieldProductsIds'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         as: 'active_orders',
  //         let: { branchId: '$branches._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $in: ['$branchId', '$$branchId'] },
  //                   { $ne: ['$status', ORDER_EXPIRED_STATUS] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchOrders,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'orders',
  //         as: 'clients_orders',
  //         let: { branchesIds: '$branches._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $in: ['$branchId', '$$branchesIds'] }],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchOrders,
  //             },
  //           },
  //           {
  //             $group: {
  //               _id: '$clientId',
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'ratings',
  //         as: 'ratings',
  //         let: { localFieldMerchantId: '$_id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$merchant', '$$localFieldMerchantId'] }],
  //               },
  //             },
  //           },
  //           {
  //             $match: {
  //               ...generateMatchOrders,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         commercialRegistrationNumber: 1,
  //         commercialName: 1,
  //         branchesNumber: 1,
  //         hasDeliveryService: 1,
  //         address: 1,
  //         uuid: 1,
  //         status: 1,
  //         status_tags: 1,
  //         visibility_status: 1,
  //         logo: 1,
  //         identificationImage: 1,
  //         commercialIdImage: 1,
  //         balance: 1,
  //         location: 1,
  //         locationDelta: 1,
  //         notes: 1,
  //         ownerId: 1,
  //         cityId: 1,
  //         categoriesIds: 1,
  //         tagsIds: 1,
  //         city: 1,
  //         categories: 1,
  //         tags: 1,
  //         isDeleted: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         branches: 1,
  //         twitterUrl: 1,
  //         facebookUrl: 1,
  //         websiteUrl: 1,
  //         snapUrl: 1,
  //         tiktokUrl: 1,
  //         bankAccount: 1,
  //         lowestPriceToOrder: 1,
  //         minimum_delivery_price: 1,
  //         reservations: 1,
  //         ordersProductsItems: 1,
  //         productsIntoOrders: 1,
  //         totalBranchesCount: { $size: { $ifNull: ['$branches', 0] } },
  //         totalMerchantEmployeesCount: {
  //           $size: { $ifNull: ['$merchantEmployees', 0] },
  //         },
  //         totalOrdersCount: { $size: { $ifNull: ['$orders', 0] } },
  //         totalOrdersPrice: {
  //           $sum: { $ifNull: ['$orders.invoice.total', 0] },
  //         },
  //         totalClientsOrdersCount: {
  //           $size: { $ifNull: ['$clients_orders', 0] },
  //         },
  //         totalRatesCount: { $size: { $ifNull: ['$ratings', 0] } },
  //         totalComplaintsAndSuggestionsCount: {
  //           $size: { $ifNull: ['$compliant', []] },
  //         },
  //         totalProductsIntoOrdersCount: {
  //           $size: { $ifNull: ['$productsIntoOrders', 0] },
  //         },
  //         totalProductsCount: { $size: { $ifNull: ['$products', 0] } },
  //         totalReservationsCount: { $size: { $ifNull: ['$reservations', 0] } },
  //         revenue: {
  //           $sum: { $ifNull: ['$orders.invoice.total', 0] },
  //         },
  //         acceptedOrders: 1,
  //         totalVisitsCount: {
  //           $sum: [
  //             '$websiteUrl.visits',
  //             '$twitterUrl.visits',
  //             '$facebookUrl.visits',
  //             '$snapUrl.visits',
  //             '$tiktokUrl.visits',
  //           ],
  //         },
  //         orders: 1,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$city',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //   ]);

  //   let totalProductsCount = 0;

  //   if (result[0]) {
  //     result[0]['productsIntoOrders'] =
  //       result?.[0]?.productsIntoOrders.map((product) => {
  //         let count = 0;
  //         for (let i = 0; i < result?.[0]?.ordersProductsItems?.length; i++) {
  //           if (
  //             result?.[0]?.ordersProductsItems[i].productId.toString() ==
  //             product._id.toString()
  //           ) {
  //             count += result?.[0]?.ordersProductsItems[i].count;
  //             totalProductsCount += result?.[0]?.ordersProductsItems[i].count;
  //           }
  //         }
  //         return { ...product, count };
  //       }) || [];

  //     delete result?.[0]?.ordersProductsItems;

  //     result[0].totalProductsPerBranchesCount = totalProductsCount;
  //   }

  //   const groups = result?.[0]?.acceptedOrders?.map((ele) => {
  //     return {
  //       date: ele?._id,
  //       revenue: ele.sum,
  //     };
  //   });

  //   delete result?.[0]?.acceptedOrders;

  //   result[0]['groups'] = groups;

  //   return { ...result?.[0] };
  // }

  // async getMarketplaceMerchantinfo(merchantId: string, clientId: any) {
  //   const [result] = await this._model.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(merchantId),
  //         isDeleted: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         as: 'branches',
  //         let: {
  //           localFieldMerchantId: { $toObjectId: '$_id' },
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   { $eq: ['$isDeleted', false] },
  //                   { $eq: ['$status', BRANCH_STATUS.APPROVED_STATUS] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         as: 'products',
  //         let: {
  //           localFieldMerchantId: { $toObjectId: '$_id' },
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$merchantId', '$$localFieldMerchantId'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'favorites',
  //         as: 'favorites',
  //         let: {
  //           localFieldMerchantId: { $toObjectId: '$_id' },
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                   {
  //                     $eq: [
  //                       '$clientId',
  //                       new mongoose.Types.ObjectId(clientId) || '',
  //                     ],
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'tags',
  //         as: 'tags',
  //         let: {
  //           tagsIds: '$tagsIds',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $in: ['$_id', '$$tagsIds'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         as: 'categories',
  //         let: {
  //           categoriesIds: '$categoriesIds',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $in: ['$_id', '$$categoriesIds'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'ratings',
  //         as: 'ratings',
  //         let: { localFieldMerchantId: '$_id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchant', '$$localFieldMerchantId'] },
  //                   { $eq: ['$is_public', true] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'ratingscales',
  //               localField: 'rating',
  //               foreignField: '_id',
  //               as: 'ratingscales',
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$ratingscales',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //         ],
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
  //     {
  //       $unwind: {
  //         path: '$city',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'countries',
  //         localField: 'city.country',
  //         foreignField: '_id',
  //         as: 'country',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$country',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         description: 1,
  //         createdAt: 1,
  //         logo: 1,
  //         twitterUrl: 1,
  //         facebookUrl: 1,
  //         websiteUrl: 1,
  //         snapUrl: 1,
  //         tiktokUrl: 1,
  //         name: 1,
  //         status: 1,
  //         status_tags: 1,
  //         visibility_status: 1,
  //         translation: 1,
  //         branches: 1,
  //         lowestPriceToOrder: 1,
  //         minimum_delivery_price: 1,
  //         avgProductsPrepTime: {
  //           $avg: { $ifNull: ['$products.preparationTime', []] },
  //         },
  //         avgProductsPrice: { $avg: { $ifNull: ['$products.price', []] } },
  //         isLiked: {
  //           $cond: {
  //             if: { $eq: ['$favorites', []] },
  //             then: false,
  //             else: true,
  //           },
  //         },
  //         tags: 1,
  //         categories: 1,
  //         ratings: 1,
  //         avgRatings: { $avg: { $ifNull: ['$ratings.ratingscales.level', 0] } },
  //         countRatings: { $size: { $ifNull: ['$ratings', 0] } },
  //         updatedAt: 1,
  //         mobile: 1,
  //         city: 1,
  //         country: 1,
  //       },
  //     },
  //   ]);

  //   if (!result) {
  //     throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
  //   }

  //   return result;
  // }

  // async getDashboardMerchantsStatistics(
  //   params: FindDashboardMerchantsStatisticsDto,
  // ) {
  //   const { ...rest } = params;
  //   const generatedMatch = generateFilters(rest);
  //   let generateMatchDates = {};

  //   if (generatedMatch['createdAt']) {
  //     generateMatchDates = { createdAt: generatedMatch['createdAt'] };
  //     delete generatedMatch['createdAt'];
  //   }

  //   const result = await this.nModel.aggregate([
  //     {
  //       $facet: {
  //         Result1: [
  //           {
  //             $match: {
  //               isDeleted: false,
  //             },
  //           },
  //           {
  //             $count: 'totalMerchantsCount',
  //           },
  //         ],
  //         Result2: [
  //           {
  //             $match: {
  //               isDeleted: false,
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'users',
  //               let: { localFieldMerchantId: '$_id' },
  //               as: 'merchantEmployees',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                         { $eq: ['$type', 'MerchantEmployee'] },
  //                         { $eq: ['$isDeleted', false] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'branches',
  //               let: { localFieldMerchantId: '$_id' },
  //               as: 'branches',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                         { $eq: ['$isDeleted', false] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'reservations',
  //               localField: 'branches._id',
  //               foreignField: 'branch',
  //               as: 'reservations',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'orders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $in: ['$branchId', '$$localFieldBranchId'] }],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'pendingOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: ['$status', ORDER_STATUS.ORDER_PENDING_STATUS],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'expiredOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: ['$status', ORDER_STATUS.ORDER_EXPIRED_STATUS],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'deliveredOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_DELIVERED_STATUS,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'rejectedOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $in: ['$branchId', '$$localFieldBranchId'] }],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $or: [
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_REJECTED_BY_EMPLOYEE_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_REJECTED_BY_MERCHANT_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_REJECTED_BY_OPERATION_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_REJECTED_BY_SHOPPEX_STATUS,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'canceledOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $in: ['$branchId', '$$localFieldBranchId'] }],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $or: [
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CANCELED_BY_MERCHANT_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CANCELED_BY_OPERATION_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CANCELED_BY_CLIENT_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CANCELED_BY_EMPLOYEE_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CANCELED_BY_SHOPPEX_STATUS,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'acceptedOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_ACCEPTED_STATUS,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'readyOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         { $eq: ['$status', ORDER_STATUS.ORDER_READY_STATUS] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'onWayToClientOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'arrivedToClientOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'clientNotRespondOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CLIENT_NOT_RESPOND,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { localFieldBranchId: '$branches._id' },
  //               as: 'clientNotDeliveredOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$localFieldBranchId'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_CLIENT_NOT_DELIVERED,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     invoice: 1,
  //                     createdAt: 1,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               as: 'active_orders',
  //               let: { branchId: '$branches._id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$branchId'] },
  //                         { $ne: ['$status', ORDER_EXPIRED_STATUS] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               as: 'clients_orders',
  //               let: { branchesIds: '$branches._id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $in: ['$branchId', '$$branchesIds'] }],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $group: {
  //                     _id: '$clientId',
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $project: {
  //               totalMerchantEmployeesCount: {
  //                 $size: { $ifNull: ['$merchantEmployees', 0] },
  //               },
  //               totalOrdersCount: { $size: { $ifNull: ['$orders', 0] } },
  //               totalOrdersPrice: {
  //                 $sum: { $ifNull: ['$deliveredOrders.invoice.total', 0] },
  //               },
  //               totalPendingOrdersCount: {
  //                 $size: { $ifNull: ['$pendingOrders', 0] },
  //               },
  //               totalReadyOrdersCount: {
  //                 $size: { $ifNull: ['$readyOrders', 0] },
  //               },
  //               totalAcceptedOrdersCount: {
  //                 $size: { $ifNull: ['$acceptedOrders', 0] },
  //               },
  //               totalDeliveredOrdersCount: {
  //                 $size: { $ifNull: ['$deliveredOrders', 0] },
  //               },
  //               totalCanceledOrdersCount: {
  //                 $size: { $ifNull: ['$canceledOrders', 0] },
  //               },
  //               totalRejectedOrdersCount: {
  //                 $size: { $ifNull: ['$rejectedOrders', 0] },
  //               },
  //               totalExpiredOrdersCount: {
  //                 $size: { $ifNull: ['$expiredOrders', 0] },
  //               },
  //               totalOnWayToClientOrdersCount: {
  //                 $size: { $ifNull: ['$onWayToClientOrders', 0] },
  //               },
  //               totalArrivedToClientOrdersCount: {
  //                 $size: { $ifNull: ['$arrivedToClientOrders', 0] },
  //               },
  //               totalClientNotRespondOrdersCount: {
  //                 $size: { $ifNull: ['$clientNotRespondOrders', 0] },
  //               },
  //               totalClientNotDeliveredOrdersCount: {
  //                 $size: { $ifNull: ['$clientNotDeliveredOrders', 0] },
  //               },
  //               totalOrdersClientsCount: {
  //                 $size: { $ifNull: ['$clients_orders', 0] },
  //               },
  //               totalReservationsCount: {
  //                 $size: { $ifNull: ['$reservations', 0] },
  //               },
  //               totalComplaintsAndSuggestionsCount: {
  //                 $size: { $ifNull: ['$compliant', []] },
  //               },
  //             },
  //           },
  //           {
  //             $group: {
  //               _id: null,
  //               totalMerchantEmployeesCount: {
  //                 $sum: { $ifNull: ['$totalMerchantEmployeesCount', 0] },
  //               },
  //               totalOrdersCount: {
  //                 $sum: { $ifNull: ['$totalOrdersCount', 0] },
  //               },
  //               totalOrdersPrice: {
  //                 $sum: { $ifNull: ['$totalOrdersPrice', 0] },
  //               },
  //               totalPendingOrdersCount: {
  //                 $sum: { $ifNull: ['$totalPendingOrdersCount', 0] },
  //               },
  //               totalReadyOrdersCount: {
  //                 $sum: { $ifNull: ['$totalReadyOrdersCount', 0] },
  //               },
  //               totalAcceptedOrdersCount: {
  //                 $sum: { $ifNull: ['$totalAcceptedOrdersCount', 0] },
  //               },
  //               totalDeliveredOrdersCount: {
  //                 $sum: { $ifNull: ['$totalDeliveredOrdersCount', 0] },
  //               },
  //               totalCanceledOrdersCount: {
  //                 $sum: { $ifNull: ['$totalCanceledOrdersCount', 0] },
  //               },
  //               totalRejectedOrdersCount: {
  //                 $sum: { $ifNull: ['$totalRejectedOrdersCount', 0] },
  //               },
  //               totalExpiredOrdersCount: {
  //                 $sum: { $ifNull: ['$totalExpiredOrdersCount', 0] },
  //               },
  //               totalOnWayToClientOrdersCount: {
  //                 $sum: { $ifNull: ['$totalOnWayToClientOrdersCount', 0] },
  //               },
  //               totalArrivedToClientOrdersCount: {
  //                 $sum: { $ifNull: ['$totalArrivedToClientOrdersCount', 0] },
  //               },
  //               totalClientNotRespondOrdersCount: {
  //                 $sum: { $ifNull: ['$totalClientNotRespondOrdersCount', 0] },
  //               },
  //               totalClientNotDeliveredOrdersCount: {
  //                 $sum: { $ifNull: ['$totalClientNotDeliveredOrdersCount', 0] },
  //               },
  //               totalOrdersClientsCount: {
  //                 $sum: { $ifNull: ['$totalOrdersClientsCount', 0] },
  //               },
  //               totalReservationsCount: {
  //                 $sum: { $ifNull: ['$totalReservationsCount', 0] },
  //               },
  //               totalComplaintsAndSuggestionsCount: {
  //                 $sum: { $ifNull: ['$totalComplaintsAndSuggestionsCount', 0] },
  //               },
  //             },
  //           },
  //         ],
  //         Result3: [
  //           {
  //             $match: {
  //               isDeleted: false,
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'branches',
  //               let: { localFieldMerchantId: '$_id' },
  //               as: 'branches',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                         { $eq: ['$isDeleted', false] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               as: 'clients_orders',
  //               let: { branchesIds: '$branches._id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$branchesIds'] },
  //                         {
  //                           $gte: [
  //                             '$createdAt',
  //                             {
  //                               $dateSubtract: {
  //                                 startDate: '$$NOW',
  //                                 unit: 'month',
  //                                 amount: 6,
  //                               },
  //                             },
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $match: {
  //                     ...generateMatchDates,
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     clientId: 1,
  //                     createdAt: {
  //                       $dateToString: {
  //                         format: '%Y-%m-%d',
  //                         date: '$createdAt',
  //                       },
  //                     },
  //                     count: { $literal: 1 },
  //                   },
  //                 },
  //                 {
  //                   $group: {
  //                     _id: { clientId: '$clientId' },
  //                     createdAt: { $first: '$createdAt' },
  //                     count: { $first: '$count' },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $unwind: '$clients_orders',
  //           },
  //           {
  //             $group: {
  //               _id: null,
  //               allOrdersClients: { $push: '$clients_orders' },
  //             },
  //           },
  //           {
  //             $project: {
  //               allOrdersClients: 1,
  //             },
  //           },
  //         ],
  //         Result4: [
  //           {
  //             $match: {
  //               isDeleted: false,
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'branches',
  //               let: { localFieldMerchantId: '$_id' },
  //               as: 'branches',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                         { $eq: ['$isDeleted', false] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'orders',
  //               let: { branchesIds: '$branches._id' },
  //               as: 'deliveredOrders',
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $in: ['$branchId', '$$branchesIds'] },
  //                         {
  //                           $eq: [
  //                             '$status',
  //                             ORDER_STATUS.ORDER_DELIVERED_STATUS,
  //                           ],
  //                         },
  //                         {
  //                           $gte: [
  //                             '$createdAt',
  //                             {
  //                               $dateSubtract: {
  //                                 startDate: '$$NOW',
  //                                 unit: 'month',
  //                                 amount: 6,
  //                               },
  //                             },
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $match: {
  //                     ...generateMatchDates,
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     totalInvoice: {
  //                       $toDouble: '$invoice.total',
  //                     },
  //                     createdAt: {
  //                       $dateToString: {
  //                         format: '%Y-%m-%d',
  //                         date: '$createdAt',
  //                       },
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $group: {
  //                     _id: '$createdAt',
  //                     createdAt: { $first: '$createdAt' },
  //                     revenue: {
  //                       $sum: {
  //                         $toDouble: '$totalInvoice',
  //                       },
  //                     },
  //                   },
  //                 },
  //                 {
  //                   $project: {
  //                     _id: 1,
  //                     createdAt: 1,
  //                     revenue: { $round: ['$revenue', 2] },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           { $unwind: '$deliveredOrders' },
  //           {
  //             $group: {
  //               _id: null,
  //               allRevenues: { $push: '$deliveredOrders' },
  //             },
  //           },
  //           {
  //             $project: {
  //               allRevenues: 1,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   ]);

  //   const ordersClients = Array.from(
  //     result?.[0]?.Result3?.[0]?.allOrdersClients?.reduce(
  //       (m, { createdAt, count }) =>
  //         m.set(createdAt, (m.get(createdAt) || 0) + count),
  //       new Map(),
  //     ),
  //     ([createdAt, count]) => ({ createdAt, count }),
  //   )?.sort((a, b) => Date.parse(a?.createdAt) - Date.parse(b?.createdAt));

  //   const ordersRevenues = Array.from(
  //     result?.[0]?.Result4?.[0]?.allRevenues?.reduce(
  //       (m, { createdAt, revenue }) =>
  //         m.set(createdAt, (m.get(createdAt) || 0) + revenue),
  //       new Map(),
  //     ),
  //     ([createdAt, revenue]) => ({ createdAt, revenue }),
  //   )?.sort((a, b) => Date.parse(a?.createdAt) - Date.parse(b?.createdAt));

  //   const totalRevenues = result?.[0]?.Result4?.[0]?.allRevenues?.reduce(
  //     (acc, obj) => acc + (obj?.revenue || 0),
  //     0,
  //   );

  //   return {
  //     ...result[0].Result1[0],
  //     ...result[0].Result2[0],
  //     ordersClients,
  //     ordersRevenues,
  //     totalRevenues,
  //   };
  // }

  // async dashboardFindAllMerchantsMenuUpload(
  //   user: any,
  //   query: MenuUploadFilterDto,
  // ) {
  //   const { limit = 25, page = 0, ...rest } = query;
  //   const generatedMatch = generateFilters(rest);

  //   const merchants = await this.aggregate([
  //     {
  //       $match: {
  //         menu_upload_status: {
  //           $exists: true,
  //         },
  //         $expr: {
  //           $and: [
  //             { $ne: ['$menu_upload_status', undefined] },
  //             { $ne: ['$menu_upload_status', null] },
  //             { $eq: ['$isDeleted', false] },
  //           ],
  //         },
  //       },
  //     },
  //     {
  //       $match: {
  //         ...generatedMatch,
  //       },
  //     },
  //     {
  //       $addFields: {
  //         merchantId: '$_id',
  //       },
  //     },
  //     {
  //       $project: {
  //         merchantId: 1,
  //         name: 1,
  //         translation: 1,
  //         menu_upload_status: 1,
  //         menuUpload: 1,
  //       },
  //     },
  //     {
  //       $skip: page <= 0 ? 0 : limit * page,
  //     },
  //     {
  //       $limit: limit,
  //     },
  //   ]);

  //   return merchants;
  // }
}
