import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as MomentTz from 'moment-timezone';
import mongoose, { Model, Types } from 'mongoose';

import { Order } from '../../../libs/database/src/lib/models/order/order.schema';
import { ONLINE_STATUS as MERCHANT_ONLINE_STATUS, MERCHANT_STATUS } from '../../modules/common/constants/merchant';
import {
  ORDER_ACCEPTED_STATUS,
  ORDER_CANCELED_BY_OPERATION_STATUS,
  ORDER_DELIVERED_STATUS,
  ORDER_PENDING_STATUS,
  ORDER_READY_STATUS,
  ORDER_STATUS,
  ORDER_TYPE,
} from './../../modules/common/constants/order.constants';
import {
  ORDER_NOT_RATED,
  ORDER_RATE_IGNORED,
  ORDER_RATED,
} from './../../modules/common/constants/rate-status.constants';
import generateFilters from '../../modules/common/utils/generate-filters';
import generatePagination from '../../modules/common/utils/generate-pagination';
// import { GetAllClientHistoryDto } from '../../order/dto/create-client-order-history.dto';
// import { FindAllClientsClusteringDto } from '../../order/dto/dashboard-find-all-client-clustering.dto';
// import { DashboardOrderQueryDto } from '../../order/dto/dashboard-orders-query.dto';
import { BaseRepository } from '../BaseRepository';
import { SettingRepository } from '../setting/setting.repository';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectModel(Order.name)
    private readonly nModel: Model<Order>,
    private settingRepository: SettingRepository,
  ) {
    super(nModel);
  }

  // public async listOrdersDashboard(
  //   query: DashboardOrderQueryDto,
  //   branchId?: string,
  // ) {
  //   const { limit, page, paginate = true, ...rest } = query;

  //   const generatedMatch = generateFilters(rest);
  //   const pagination =
  //     !isNaN(page) || !isNaN(limit) ? generatePagination(limit, page) : [];

  //   if (generatedMatch['orderRefId']) {
  //     Object.assign(generatedMatch, {
  //       orderRefId: generatedMatch['orderRefId'],
  //     });
  //   }

  //   if (generatedMatch['clientMobile']) {
  //     delete Object.assign(generatedMatch, {
  //       'orderCreatedBy.mobile': generatedMatch['clientMobile'],
  //     })['clientMobile'];
  //   }

  //   if (generatedMatch['clientEmail']) {
  //     delete Object.assign(generatedMatch, {
  //       'orderCreatedBy.email': generatedMatch['clientEmail'],
  //     })['clientEmail'];
  //   }

  //   if (generatedMatch['clientName']) {
  //     delete Object.assign(generatedMatch, {
  //       'orderCreatedBy.name': generatedMatch['clientName'],
  //     })['clientName'];
  //   }

  //   if (
  //     generatedMatch['transactionRefId'] &&
  //     mongoose.Types.ObjectId.isValid(generatedMatch['transactionRefId'])
  //   ) {
  //     delete Object.assign(generatedMatch, {
  //       'transaction._id': new Types.ObjectId(
  //         generatedMatch['transactionRefId'],
  //       ),
  //     })['transactionRefId'];
  //   }

  //   const settingOrder = await this.settingRepository.getOne({
  //     modelName: 'Order',
  //   });
  //   const timeAfterDeliveredOrder =
  //     settingOrder && !isNaN(settingOrder['TimeAfterDeliveredOrder'])
  //       ? settingOrder['TimeAfterDeliveredOrder']
  //       : 3;
  //   const dateTimeAfterDeliveredOrder = new Date(
  //     Date.now() - timeAfterDeliveredOrder * 60 * 60 * 1000,
  //   );

  //   const [orders] = await this.nModel.aggregate([
  //     {
  //       $match: branchId
  //         ? {
  //             branchId: new Types.ObjectId(branchId),
  //           }
  //         : {},
  //     },
  //     {
  //       $match: {
  //         $expr: {
  //           $or: [
  //             {
  //               $and: [{ $ne: ['$status', ORDER_DELIVERED_STATUS] }],
  //             },
  //             {
  //               $and: [
  //                 { $eq: ['$status', ORDER_DELIVERED_STATUS] },
  //                 { $gte: ['$updatedAt', dateTimeAfterDeliveredOrder] },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     },
  //     {
  //       $facet: {
  //         Orders: [
  //           {
  //             $lookup: {
  //               from: 'branches',
  //               let: { branch: '$branchId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$_id', '$$branch'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'branch',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'merchants',
  //               localField: 'branch.merchantId',
  //               foreignField: '_id',
  //               as: 'merchant',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'transactions',
  //               let: { order: '$_id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$orderId', '$$order'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'transaction',
  //             },
  //           },
  //           { $unwind: '$branch' },
  //           {
  //             $unwind: {
  //               path: '$transaction',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           { $unwind: '$items' },
  //           { $unwind: '$merchant' },
  //           {
  //             $lookup: {
  //               from: 'products',
  //               let: { product: '$items.productId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$_id', '$$product'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'items.product',
  //             },
  //           },
  //           { $unwind: '$items.product' },
  //           {
  //             $lookup: {
  //               from: 'productgroups',
  //               localField: 'items.groups.productGroupId',
  //               foreignField: '_id',
  //               as: 'items.productgroups',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'users',
  //               localField: 'orderCreatedBy',
  //               foreignField: '_id',
  //               as: 'orderCreatedBy',
  //             },
  //           },
  //           { $unwind: '$orderCreatedBy' },
  //           {
  //             $lookup: {
  //               from: 'drivers',
  //               localField: 'driverId',
  //               foreignField: '_id',
  //               as: 'driver',
  //             },
  //           },
  //           { $unwind: { path: '$driver', preserveNullAndEmptyArrays: true } },
  //           {
  //             $lookup: {
  //               from: 'tables',
  //               let: { tableId: '$tableId', branchId: '$branchId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$_id', '$$tableId'] },
  //                         { $eq: ['$branchId', '$$branchId'] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'table',
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$table',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           {
  //             $match: generatedMatch,
  //             //  $match: generatedSearch,
  //           },
  //           {
  //             $group: {
  //               _id: '$_id',
  //               merchant: { $first: '$merchant' },
  //               status: { $first: '$status' },
  //               estimatedPreparationTime: {
  //                 $first: '$estimatedPreparationTime',
  //               },
  //               paymentType: { $first: '$paymentType' },
  //               isDeleted: { $first: '$isDeleted' },
  //               localOrder: { $first: '$localOrder' },
  //               orderType: { $first: '$orderType' },
  //               orderRefId: { $first: '$orderRefId' },
  //               orderSeqId: { $first: '$orderSeqId' },
  //               createdAt: { $first: '$createdAt' },
  //               updatedAt: { $first: '$updatedAt' },
  //               invoice: { $first: '$invoice' },
  //               branch: { $first: '$branch' },
  //               orderCreatedBy: { $first: '$orderCreatedBy' },
  //               transaction: { $first: '$transaction' },
  //               driverId: { $first: '$driverId' },
  //               driver: { $first: '$driver' },
  //               items: { $push: '$items' },
  //               tableId: { $first: '$tableId' },
  //               table: { $first: '$table' },
  //             },
  //           },
  //           {
  //             $project: {
  //               _id: 1,
  //               merchant: 1,
  //               status: 1,
  //               estimatedPreparationTime: 1,
  //               paymentType: 1,
  //               isDeleted: 1,
  //               localOrder: 1,
  //               orderType: 1,
  //               orderRefId: 1,
  //               orderSeqId: 1,
  //               createdAt: 1,
  //               updatedAt: 1,
  //               branch: 1,
  //               orderCreatedBy: 1,
  //               invoice: 1,
  //               transaction: 1,
  //               items: 1,
  //               driverId: 1,
  //               driver: 1,
  //               tableId: 1,
  //               table: 1,
  //             },
  //           },
  //           { $sort: { createdAt: -1 } },
  //           ...pagination,
  //         ],
  //         DeliveredOrders: [
  //           {
  //             $match: {
  //               status: ORDER_DELIVERED_STATUS,
  //               updatedAt: { $gte: dateTimeAfterDeliveredOrder },
  //             },
  //           },
  //           { $group: { _id: null, DeliveredCount: { $sum: 1 } } },
  //         ],
  //         ReadyOrders: [
  //           {
  //             $match: {
  //               status: {
  //                 $in: [ORDER_READY_STATUS],
  //               },
  //             },
  //           },
  //           { $group: { _id: null, ReadyCount: { $sum: 1 } } },
  //         ],
  //         AcceptedOrders: [
  //           {
  //             $match: {
  //               status: {
  //                 $in: [ORDER_ACCEPTED_STATUS],
  //               },
  //             },
  //           },
  //           { $group: { _id: null, AcceptedCount: { $sum: 1 } } },
  //         ],
  //         CanceledByStore: [
  //           {
  //             $match: {
  //               status: ORDER_CANCELED_BY_OPERATION_STATUS,
  //             },
  //           },
  //           { $group: { _id: null, CanceledByStoreCount: { $sum: 1 } } },
  //         ],
  //         PendingOrders: [
  //           {
  //             $match: {
  //               status: ORDER_PENDING_STATUS,
  //             },
  //           },
  //           { $group: { _id: null, PendingCount: { $sum: 1 } } },
  //         ],
  //         Count: [
  //           {
  //             $lookup: {
  //               from: 'users',
  //               localField: 'orderCreatedBy',
  //               foreignField: '_id',
  //               as: 'orderCreatedBy',
  //             },
  //           },
  //           {
  //             $match: generatedMatch,
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //         ],
  //       },
  //     },
  //   ]);

  //   return {
  //     Orders: orders?.Orders,
  //     Delivered: orders?.DeliveredOrders[0]?.DeliveredCount || 0,
  //     Ready: orders?.ReadyOrders[0]?.ReadyCount || 0,
  //     Accepted: orders?.AcceptedOrders[0]?.AcceptedCount || 0,
  //     CanceledByStore: orders?.CanceledByStore[0]?.CanceledByStoreCount || 0,
  //     Pending: orders?.PendingOrders[0]?.PendingCount || 0,
  //     page,
  //     pageCount: Math.ceil(orders?.Count[0]?.count / limit) || 1,
  //     length: orders?.Count[0]?.count || 0,
  //   };
  // }

  // async getClientOrderingHistory(user: any, query: GetAllClientHistoryDto) {
  //   const { _id } = user;
  //   const { longitude, latitude } = query;

  //   return this.nModel.aggregate([
  //     {
  //       $match: {
  //         clientId: new Types.ObjectId(_id),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         let: { branch: '$branchId' },
  //         pipeline: [
  //           {
  //             $geoNear: {
  //               near: {
  //                 type: 'Point',
  //                 coordinates: [longitude || 0, latitude || 0],
  //               },
  //               distanceField: 'dist.calculated',
  //               includeLocs: 'dist.location',
  //               spherical: true,
  //             },
  //           },
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$_id', '$$branch'] }],
  //               },
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'merchants',
  //               let: {
  //                 localMerchant: '$merchantId',
  //               },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$_id', '$$localMerchant'] },
  //                         {
  //                           $eq: ['$status', MERCHANT_STATUS.APPROVED_STATUS],
  //                         },
  //                         // {
  //                         //   $eq: ['$visibility_status', MERCHANT_ONLINE_STATUS],
  //                         // },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'merchant',
  //             },
  //           },
  //           {
  //             $unwind: { path: '$merchant', preserveNullAndEmptyArrays: true },
  //           },
  //           {
  //             $lookup: {
  //               from: 'favorites',
  //               as: 'favorites',
  //               let: {
  //                 localFieldMerchantId: { $toObjectId: '$merchant._id' },
  //               },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$merchantId', '$$localFieldMerchantId'] },
  //                         {
  //                           $eq: [
  //                             '$clientId',
  //                             new mongoose.Types.ObjectId(user._id),
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //         as: 'branch',
  //       },
  //     },
  //     { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } },
  //     {
  //       $group: {
  //         _id: '$branch.merchant._id',
  //         branch: { $first: '$branch' },
  //         branchId: { $first: '$branch._id' },
  //         client_visits: { $first: '$client_visits' },
  //         name: { $first: '$name' },
  //         translation: { $first: '$translation' },
  //         location: { $first: '$location' },
  //         merchant: { $first: '$branch.merchant' },
  //         favorites: { $first: '$branch.favorites' },
  //         visibility_status: { $first: '$visibility_status' },
  //         dist: { $first: '$dist' },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'merchant.categoriesIds',
  //         foreignField: '_id',
  //         as: 'categories',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         let: {
  //           merchant: '$_id',
  //           branch: '$branchId',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $in: ['$$branch', '$branchesIds'] },
  //                   { $eq: ['$merchantId', '$$merchant'] },
  //                   { $eq: ['$isDeleted', false] },
  //                 ],
  //               },
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$categoriesIds',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //         ],
  //         as: 'products',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'productcategories',
  //         let: {
  //           productCategories: '$products.categoriesIds',
  //           merchant: '$_id',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$merchantId', '$$merchant'] },
  //                   { $in: ['$_id', '$$productCategories'] },
  //                   { $eq: ['$isDeleted', false] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: 'productCategories',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'tags',
  //         let: {
  //           tags: '$merchant.tagsIds',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $in: ['$_id', '$$tags'] },
  //                   { $eq: ['$client_visibility', true] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: 'tags',
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$branchId',
  //         name: { $first: '$branch.name' },
  //         translation: { $first: '$branch.translation' },
  //         visibility_status: { $first: '$branch.visibility_status' },
  //         location: { $first: '$branch.location' },
  //         client_visits: { $first: '$branch.client_visits' },
  //         dist: { $first: '$branch.dist' },
  //         merchant: { $first: '$merchant' },
  //         favorites: { $first: '$favorites' },
  //         productCategories: { $first: '$productCategories' },
  //         products: { $first: '$products' },
  //         categories: { $first: '$categories' },
  //         tags: { $first: '$tags' },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         translation: 1,
  //         visibility_status: 1,
  //         location: 1,
  //         client_visits: 1,
  //         productCategories: 1,
  //         dist: 1,
  //         rate: { $size: { $ifNull: ['$merchant.categoriesIds', []] } },
  //         avgProductsPrice: { $trunc: [{ $avg: '$products.price' }, 0] },
  //         avgProductsPrepTime: {
  //           $trunc: [{ $avg: '$products.preparationTime' }, 0],
  //         },
  //         'merchant._id': 1,
  //         'merchant.logo': 1,
  //         'merchant.name': 1,
  //         'merchant.translation': 1,
  //         'merchant.productsPriceRange': 1,
  //         'merchant.isLiked': {
  //           $cond: {
  //             if: { $eq: ['$favorites', []] },
  //             then: false,
  //             else: true,
  //           },
  //         },
  //         'categories._id': 1,
  //         'categories.name': 1,
  //         'categories.translation': 1,
  //         'tags._id': 1,
  //         'tags.name': 1,
  //         'tags.translation': 1,
  //       },
  //     },
  //     { $limit: 5 },
  //   ]);
  // }

  // public async getLatestOrder(client: string): Promise<{
  //   success: boolean;
  //   message?: string;
  //   rated?: boolean;
  //   data?: any;
  // }> {
  //   try {
  //     const [latestOrder] = await this.nModel
  //       .find({
  //         status: ORDER_DELIVERED_STATUS,
  //         clientId: new mongoose.Types.ObjectId(client),
  //       })
  //       .limit(1)
  //       .sort({ $natural: -1 })
  //       .lean()
  //       .select({ rateStatus: 1 })
  //       .exec();
  //     if (!latestOrder)
  //       return {
  //         success: true,
  //         message: 'no orders exist for this user',
  //       };
  //     if (latestOrder.rateStatus === ORDER_RATE_IGNORED)
  //       return {
  //         success: true,
  //         rated: true,
  //       };
  //     if (latestOrder.rateStatus === ORDER_NOT_RATED) {
  //       const [data] = await this._model.aggregate([
  //         {
  //           $match: {
  //             _id: latestOrder._id,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'branches',
  //             localField: 'branchId',
  //             foreignField: '_id',
  //             as: 'branch',
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'merchants',
  //             localField: 'branch.merchantId',
  //             foreignField: '_id',
  //             as: 'merchant',
  //           },
  //         },
  //         { $unwind: '$branch' },
  //         { $unwind: '$merchant' },
  //         {
  //           $lookup: {
  //             from: 'ratings',
  //             let: { merchant: '$merchant._id' },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: {
  //                     $and: [
  //                       {
  //                         $eq: ['$merchant', '$$merchant'],
  //                       },
  //                     ],
  //                   },
  //                 },
  //               },
  //               {
  //                 $lookup: {
  //                   from: 'ratingscales',
  //                   localField: 'rating',
  //                   foreignField: '_id',
  //                   as: 'rating',
  //                 },
  //               },
  //               { $unwind: '$rating' },
  //             ],
  //             as: 'ratings',
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 1,
  //             merchant: {
  //               _id: 1,
  //               name: 1,
  //               translation: 1,
  //               logo: 1,
  //               rating: {
  //                 $avg: { $ifNull: ['$ratings.rating.level', 0] },
  //               },
  //             },
  //             branch: 1,
  //           },
  //         },
  //       ]);
  //       return {
  //         success: true,
  //         rated: false,
  //         data,
  //       };
  //     }
  //     if (latestOrder.rateStatus === ORDER_RATED)
  //       return {
  //         success: true,
  //         rated: true,
  //       };
  //     return {
  //       success: true,
  //       message: 'no rateStatus',
  //     };
  //   } catch (error) {
  //     // return { success: false, message: `${error}` };
  //     throw new BadRequestException(error);
  //     // throw new BadRequestException(ERROR_CODES.err_failed_to_fetch_order);
  //   }
  // }

  // public async listOrdersDriver(
  //   query: DashboardOrderQueryDto,
  //   branchId: string,
  //   user: any,
  // ) {
  //   const { limit = 25, page = 0, paginate = true, ...rest } = query;

  //   const generatedMatch = generateFilters(rest);
  //   const pagination = generatePagination(limit, page);

  //   const settingOrder = await this.settingRepository.getOne({
  //     modelName: 'Order',
  //   });
  //   const timeAfterDeliveredOrder = !isNaN(
  //     settingOrder['TimeAfterDeliveredOrder'],
  //   )
  //     ? settingOrder['TimeAfterDeliveredOrder']
  //     : 3;
  //   const dateTimeAfterDeliveredOrder = new Date(
  //     Date.now() - timeAfterDeliveredOrder * 60 * 60 * 1000,
  //   );

  //   const [orders] = await this.nModel.aggregate([
  //     {
  //       $match: {
  //         orderType: ORDER_TYPE.ORDER_STORE_DELIVERY,
  //         driverId: new mongoose.Types.ObjectId(user._id.toString()),
  //       },
  //     },
  //     {
  //       $match: branchId
  //         ? {
  //             branchId: new mongoose.Types.ObjectId(branchId),
  //           }
  //         : {},
  //     },
  //     {
  //       $match: {
  //         $expr: {
  //           $or: [
  //             {
  //               $and: [{ $ne: ['$status', ORDER_DELIVERED_STATUS] }],
  //             },
  //             {
  //               $and: [
  //                 { $eq: ['$status', ORDER_DELIVERED_STATUS] },
  //                 { $gte: ['$updatedAt', dateTimeAfterDeliveredOrder] },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     },
  //     {
  //       $facet: {
  //         Orders: [
  //           {
  //             $lookup: {
  //               from: 'branches',
  //               let: { branch: '$branchId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$_id', '$$branch'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'branch',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'merchants',
  //               localField: 'branch.merchantId',
  //               foreignField: '_id',
  //               as: 'merchant',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'transactions',
  //               let: { order: '$_id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$orderId', '$$order'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'transaction',
  //             },
  //           },
  //           { $unwind: '$branch' },
  //           {
  //             $unwind: {
  //               path: '$transaction',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           { $unwind: '$items' },
  //           { $unwind: '$merchant' },
  //           {
  //             $lookup: {
  //               from: 'products',
  //               let: { product: '$items.productId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [{ $eq: ['$_id', '$$product'] }],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'items.product',
  //             },
  //           },
  //           { $unwind: '$items.product' },
  //           {
  //             $lookup: {
  //               from: 'productgroups',
  //               localField: 'items.groups.productGroupId',
  //               foreignField: '_id',
  //               as: 'items.productgroups',
  //             },
  //           },
  //           {
  //             $lookup: {
  //               from: 'users',
  //               localField: 'orderCreatedBy',
  //               foreignField: '_id',
  //               as: 'orderCreatedBy',
  //             },
  //           },
  //           { $unwind: '$orderCreatedBy' },
  //           {
  //             $lookup: {
  //               from: 'drivers',
  //               localField: 'driverId',
  //               foreignField: '_id',
  //               as: 'driver',
  //             },
  //           },
  //           { $unwind: { path: '$driver', preserveNullAndEmptyArrays: true } },
  //           {
  //             $lookup: {
  //               from: 'tables',
  //               let: { tableId: '$tableId', branchId: '$branchId' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $and: [
  //                         { $eq: ['$_id', '$$tableId'] },
  //                         { $eq: ['$branchId', '$$branchId'] },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               ],
  //               as: 'table',
  //             },
  //           },
  //           {
  //             $unwind: {
  //               path: '$table',
  //               preserveNullAndEmptyArrays: true,
  //             },
  //           },
  //           {
  //             $match: generatedMatch,
  //             //  $match: generatedSearch,
  //           },
  //           {
  //             $group: {
  //               _id: '$_id',
  //               merchant: { $first: '$merchant' },
  //               status: { $first: '$status' },
  //               estimatedPreparationTime: {
  //                 $first: '$estimatedPreparationTime',
  //               },
  //               paymentType: { $first: '$paymentType' },
  //               isDeleted: { $first: '$isDeleted' },
  //               localOrder: { $first: '$localOrder' },
  //               orderType: { $first: '$orderType' },
  //               orderRefId: { $first: '$orderRefId' },
  //               orderSeqId: { $first: '$orderSeqId' },
  //               createdAt: { $first: '$createdAt' },
  //               updatedAt: { $first: '$updatedAt' },
  //               invoice: { $first: '$invoice' },
  //               branch: { $first: '$branch' },
  //               orderCreatedBy: { $first: '$orderCreatedBy' },
  //               transaction: { $first: '$transaction' },
  //               driverId: { $first: '$driverId' },
  //               driver: { $first: '$driver' },
  //               items: { $push: '$items' },
  //               tableId: { $first: '$tableId' },
  //               table: { $first: '$table' },
  //             },
  //           },
  //           {
  //             $project: {
  //               _id: 1,
  //               merchant: 1,
  //               status: 1,
  //               estimatedPreparationTime: 1,
  //               paymentType: 1,
  //               isDeleted: 1,
  //               localOrder: 1,
  //               orderType: 1,
  //               orderRefId: 1,
  //               orderSeqId: 1,
  //               createdAt: 1,
  //               updatedAt: 1,
  //               branch: 1,
  //               orderCreatedBy: 1,
  //               invoice: 1,
  //               transaction: 1,
  //               items: 1,
  //               driverId: 1,
  //               driver: 1,
  //               tableId: 1,
  //               table: 1,
  //             },
  //           },
  //           { $sort: { createdAt: -1 } },
  //           ...pagination,
  //         ],
  //         AcceptedOrders: [
  //           {
  //             $match: {
  //               status: {
  //                 $in: [ORDER_ACCEPTED_STATUS],
  //               },
  //             },
  //           },
  //           { $group: { _id: null, AcceptedCount: { $sum: 1 } } },
  //         ],
  //         OnWayToClientOrders: [
  //           {
  //             $match: {
  //               status: ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT,
  //             },
  //           },
  //           { $group: { _id: null, OnWayToClientCount: { $sum: 1 } } },
  //         ],
  //         ClientNotRespondOrders: [
  //           {
  //             $match: {
  //               status: ORDER_STATUS.ORDER_CLIENT_NOT_RESPOND,
  //             },
  //           },
  //           { $group: { _id: null, ClientNotRespondCount: { $sum: 1 } } },
  //         ],
  //         ClientNotDeliveredOrders: [
  //           {
  //             $match: {
  //               status: ORDER_STATUS.ORDER_CLIENT_NOT_DELIVERED,
  //             },
  //           },
  //           {
  //             $group: { _id: null, ClientNotDeliveredOrderCount: { $sum: 1 } },
  //           },
  //         ],
  //         DeliveredOrders: [
  //           {
  //             $match: {
  //               status: ORDER_DELIVERED_STATUS,
  //               updatedAt: { $gte: dateTimeAfterDeliveredOrder },
  //             },
  //           },
  //           { $group: { _id: null, DeliveredCount: { $sum: 1 } } },
  //         ],
  //         Count: [
  //           {
  //             $lookup: {
  //               from: 'drivers',
  //               localField: 'driverId',
  //               foreignField: '_id',
  //               as: 'driver',
  //             },
  //           },
  //           {
  //             $match: generatedMatch,
  //           },
  //           { $group: { _id: null, count: { $sum: 1 } } },
  //         ],
  //       },
  //     },
  //   ]);

  //   return {
  //     Orders: orders?.Orders,
  //     Accepted: orders?.AcceptedOrders[0]?.AcceptedCount || 0,
  //     OnWayToClient: orders?.OnWayToClientOrders[0]?.OnWayToClientCount || 0,
  //     ClientNotRespondOrders:
  //       orders?.ClientNotRespondOrders[0]?.ClientNotRespondCount || 0,
  //     ClientNotDeliveredOrders:
  //       orders?.ClientNotDeliveredOrders[0]?.ClientNotDeliveredOrderCount || 0,
  //     Delivered: orders?.DeliveredOrders[0]?.DeliveredCount || 0,
  //     page,
  //     pageCount: Math.ceil(orders?.Count[0]?.count / limit) || 1,
  //     length: orders?.Count[0]?.count || 0,
  //   };
  // }

  // async dashboardFindAllClientsClustering(query: FindAllClientsClusteringDto) {
  //   const { ...rest } = query;
  //   const generatedMatch = generateFilters(rest);

  //   if (generatedMatch['branches']) {
  //     delete Object.assign(generatedMatch, {
  //       'branch._id': generatedMatch['branches'],
  //     })['branches'];
  //   }

  //   const results = await this._model.aggregate([
  //     {
  //       $lookup: {
  //         from: 'branches',
  //         as: 'branch',
  //         let: { branchId: '$branchId' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [{ $eq: ['$_id', '$$branchId'] }],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$branch',
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         as: 'clients_orders',
  //         let: { clientId: '$clientId' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$_id', '$$clientId'] },
  //                   { $eq: ['$type', 'Client'] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$clients_orders',
  //         preserveNullAndEmptyArrays: false, // note ignore empty clients
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'addresses',
  //         let: { clientId: '$clients_orders._id' },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ['$client', '$$clientId'] },
  //                   { $eq: ['$active', true] },
  //                 ],
  //               },
  //             },
  //           },
  //         ],
  //         as: 'address',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$address',
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },
  //     {
  //       $match: {
  //         ...generatedMatch,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: '$clients_orders._id',
  //         name: '$clients_orders.name',
  //         countryCode: '$clients_orders.countryCode',
  //         mobile: '$clients_orders.mobile',
  //         email: '$clients_orders.email',
  //         location: '$address.location',
  //         locationDelta: '$address.locationDelta',
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$_id',
  //         name: { $first: '$name' },
  //         countryCode: { $first: '$countryCode' },
  //         mobile: { $first: '$mobile' },
  //         email: { $first: '$email' },
  //         location: { $first: '$location' },
  //         locationDelta: { $first: '$locationDelta' },
  //       },
  //     },
  //   ]);
  //   return results;
  // }

  async countCouponUsePerClient(couponId: string, clientId: string) {
    const [orders] = await this._model.aggregate([
      {
        $match: {
          couponId: new Types.ObjectId(couponId),
          clientId: new Types.ObjectId(clientId),
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);
    return orders?.count || 0;
  }

  async countCouponUsePerClients(couponId: string) {
    const [orders] = await this._model.aggregate([
      {
        $match: {
          couponId: new Types.ObjectId(couponId),
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    return orders?.count || 0;
  }

  async isNewClientUseCoupon(clientId: string) {
    const [orders] = await this._model.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(clientId),
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    return orders?.count || 0;
  }

  async clientTotalOrdersCount(clientId: string) {
    const [orders] = await this._model.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(clientId),
          status: ORDER_STATUS.ORDER_DELIVERED_STATUS,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    return orders?.count || 0;
  }
}
