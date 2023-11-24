import { NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as PdfPrinter from 'pdfmake';
import { Column } from 'pdfmake/interfaces';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { FIXED } from '../../common/constants/discount.constants';
import { MERCHANT_EMPLOYEE_JOB } from '../../common/constants/merchant-employee';
import { ar, en, pdfExtraStyles, pdfExtraStylesArabic } from '../../common/constants/messages.constant';
import { IFindOneOrder, ORDER_TYPE } from '../../common/constants/order.constants';
import { OrderRepository, ProductRepository } from '../../models';
import { Item } from '../../models';
import { DraftOrderRepository } from '../../models/order/order-draft.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { DashboardCreateOrderDto } from '../dto/dashboard-create-order.dto';
import { fonts, tableLayout } from '../interfaces/pdf-invoice.interface';

export class OrderSharedService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly prodcutRepo: ProductRepository,
    private readonly draftOrderRepo: DraftOrderRepository,
  ) {}

  async prepareCreateOrder(createOrderDto: DashboardCreateOrderDto | CreateOrderDto) {
    const prepOrder = await this.prodcutRepo.prepareOrder(createOrderDto);

    let totalPrice = 0;
    createOrderDto.items.forEach((item, indexOne, originalItemArray) => {
      const product = prepOrder.find((product) => product._id.toString() === item.productId);
      (originalItemArray[indexOne].productId as mongoose.Types.ObjectId) = product._id;
      let internalPrice = 0;
      if (!product.discount) {
        internalPrice += product.price * item.count;
      } else {
        if (product.discount.type === FIXED) {
          internalPrice += (product.price - product.discount.amount) * item.count;
        } else {
          internalPrice += (product.price - product.price * (product.discount.amount / 100)) * item.count;
        }
      }
      if (item.groups) {
        const extras = [];
        item?.groups?.forEach((group, indexTwo) => {
          (originalItemArray[indexOne].groups[indexTwo].productGroupId as mongoose.Types.ObjectId) =
            new mongoose.Types.ObjectId(originalItemArray[indexOne].groups[indexTwo].productGroupId);
          group?.options?.forEach((option, indexThree) => {
            product?.groups?.forEach((group) => {
              group?.options?.find((groupOption) => {
                if (groupOption._id.toString() === option._id) {
                  (originalItemArray[indexOne].groups[indexTwo].options[indexThree]._id as mongoose.Types.ObjectId) =
                    new mongoose.Types.ObjectId(originalItemArray[indexOne].groups[indexTwo].options[indexThree]._id);
                  extras.push(groupOption);
                }
              });
            });
          });
        });
        internalPrice += extras.reduce((acc: number, next) => {
          acc += next.extraPrice * item.count; // multiply count * option extra price
          return acc;
        }, 0);
      }
      totalPrice += internalPrice;
    });

    const maxPrepTime = prepOrder.reduce((acc, product) => {
      return Math.max(acc, product.preparationTime);
    }, -Infinity);
    const estimatedPreparationTime = this.calPrepTime(new Date(), maxPrepTime);
    return {
      totalPrice,
      estimatedPreparationTime,
      items: createOrderDto.items as unknown as Item[],
    };
  }

  async prepareCreateDraftOrder(createOrderDto: DashboardCreateOrderDto | CreateOrderDto) {
    const prepOrder = await this.prodcutRepo.prepareOrder(createOrderDto);

    let totalPrice = 0;
    createOrderDto.items.forEach((item, indexOne, originalItemArray) => {
      const product = prepOrder.find((product) => product._id.toString() === item.productId);
      (originalItemArray[indexOne].productId as mongoose.Types.ObjectId) = product._id;
      let internalPrice = 0;
      if (!product.discount) {
        internalPrice += product.price * item.count;
      } else {
        if (product.discount.type === FIXED) {
          internalPrice += (product.price - product.discount.amount) * item.count;
        } else {
          internalPrice += (product.price - product.price * (product.discount.amount / 100)) * item.count;
        }
      }
      if (item.groups) {
        const extras = [];
        item?.groups?.forEach((group, indexTwo) => {
          (originalItemArray[indexOne].groups[indexTwo].productGroupId as mongoose.Types.ObjectId) =
            new mongoose.Types.ObjectId(originalItemArray[indexOne].groups[indexTwo].productGroupId);
          group?.options?.forEach((option, indexThree) => {
            product?.groups?.forEach((group) => {
              group?.options?.find((groupOption) => {
                if (groupOption._id.toString() === option._id) {
                  (originalItemArray[indexOne].groups[indexTwo].options[indexThree]._id as mongoose.Types.ObjectId) =
                    new mongoose.Types.ObjectId(originalItemArray[indexOne].groups[indexTwo].options[indexThree]._id);
                  extras.push(groupOption);
                }
              });
            });
          });
        });
        internalPrice += extras.reduce((acc: number, next) => {
          acc += next.extraPrice * item.count; // multiply count * option extra price
          return acc;
        }, 0);
      }
      totalPrice += internalPrice;
    });

    const maxPrepTime = prepOrder.reduce((acc, product) => {
      return Math.max(acc, product.preparationTime);
    }, -Infinity);
    const estimatedPreparationTime = this.calPrepTime(new Date(), maxPrepTime);
    return {
      totalPrice,
      estimatedPreparationTime,
      items: createOrderDto.items as unknown as Item[],
    };
  }

  calPrepTime(dt: Date, minutes: number) {
    return new Date(dt.getTime() + minutes * 60000);
  }

  async _generateOrderRefId() {
    const order = customAlphabet('123456789ABCDEFGH', 9)();
    const isOrderRefExist = await this.orderRepo.getOne({
      orderRefId: order,
    });
    if (isOrderRefExist) await this._generateOrderRefId();
    else return '#P' + order;
  }

  async findOne(id: string, user?: any): Promise<IFindOneOrder> {
    const [order] = await this.orderRepo._model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branch: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$branch'],
                },
              },
            },
            {
              $lookup: {
                from: 'merchants',
                localField: 'merchantId',
                foreignField: '_id',
                as: 'merchant',
              },
            },
            { $unwind: '$merchant' },
            {
              $project: {
                _id: 1,
                name: 1,
                search: 1,
                mobile: 1,
                address: 1,
                cityId: 1,
                merchantId: 1,
                ownerId: 1,
                visibleToClients: 1,
                build_status: 1,
                release_status: 1,
                visibility_status: 1,
                notes: 1,
                isFreezing: 1,
                location: 1,
                locationDelta: 1,
                workingHours: 1,
                reservationsInstructions: 1,
                pickupInstructions: 1,
                deliveryInstructions: 1,
                translation: 1,
                isDeleted: 1,
                client_visits: 1,
                approvedBy: 1,
                inReview: 1,
                reservation_status: 1,
                createdAt: 1,
                updatedAt: 1,
                merchant: 1,
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $lookup: {
          from: 'productgroups',
          localField: 'items.groups.productGroupId',
          foreignField: '_id',
          as: 'groups',
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
      {
        $lookup: {
          from: 'drivers',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { tableId: '$tableId', branchId: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$tableId'] }, { $eq: ['$branchId', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'table',
        },
      },
      {
        $unwind: {
          path: '$table',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: '$branch' },
      { $unwind: '$orderCreatedBy' },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'items.productId',
        },
      },
      { $unwind: '$items.productId' },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
        },
      },
      {
        $unwind: {
          path: '$coupon',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          invoice: { $first: '$invoice' },
          status: { $first: '$status' },
          clientNotes: { $first: '$clientNotes' },
          merchantNotes: { $first: '$merchantNotes' },
          estimatedPreparationTime: { $first: '$estimatedPreparationTime' },
          localOrder: { $first: '$localOrder' },
          orderType: { $first: '$orderType' },
          orderRefId: { $first: '$orderRefId' },
          orderSeqId: { $first: '$orderSeqId' },
          rateStatus: { $first: '$rateStatus' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          groups: { $first: '$groups' },
          orderCreatedBy: { $first: '$orderCreatedBy' },
          branch: { $first: '$branch' },
          driverId: { $first: '$driverId' },
          driver: { $first: '$driver' },
          items: { $push: '$items' },
          tableId: { $first: '$tableId' },
          table: { $first: '$table' },
          couponId: { $first: '$couponId' },
          coupon: { $first: '$coupon' },
        },
      },
      {
        $project: {
          _id: 1,
          invoice: 1,
          status: 1,
          clientNotes: 1,
          merchantNotes: 1,
          estimatedPreparationTime: 1,
          localOrder: 1,
          orderType: 1,
          orderRefId: 1,
          orderSeqId: 1,
          rateStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          groups: 1,
          items: {
            count: 1,
            productId: 1,
            groups: 1,
          },
          orderCreatedBy: 1,
          merchant: '$branch.merchant',
          branch: 1,
          driverId: 1,
          driver: 1,
          tableId: 1,
          table: 1,
          couponId: 1,
          coupon: 1,
        },
      },
    ]);
    if (!order) throw new NotFoundException(ERROR_CODES.err_order_not_found);
    const options = order.groups.flatMap((group) => group.options);
    options.forEach((option) => {
      order.items.forEach((item) =>
        item.groups.forEach((group) => {
          const groupIndex = group.options.findIndex((element) => element._id.toString() === option._id.toString());
          if (groupIndex > -1) group.options[groupIndex] = option;
        }),
      );
    });
    return { ..._.omit(order, ['groups']) } as any;
  }

  async findOneDraftById(id: string, user?: any): Promise<IFindOneOrder> {
    const [order] = await this.draftOrderRepo._model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branch: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$branch'],
                },
              },
            },
            {
              $lookup: {
                from: 'merchants',
                localField: 'merchantId',
                foreignField: '_id',
                as: 'merchant',
              },
            },
            { $unwind: '$merchant' },
            {
              $project: {
                _id: 1,
                name: 1,
                search: 1,
                mobile: 1,
                address: 1,
                cityId: 1,
                merchantId: 1,
                ownerId: 1,
                visibleToClients: 1,
                build_status: 1,
                release_status: 1,
                visibility_status: 1,
                notes: 1,
                isFreezing: 1,
                location: 1,
                locationDelta: 1,
                workingHours: 1,
                reservationsInstructions: 1,
                pickupInstructions: 1,
                deliveryInstructions: 1,
                translation: 1,
                isDeleted: 1,
                client_visits: 1,
                approvedBy: 1,
                inReview: 1,
                reservation_status: 1,
                createdAt: 1,
                updatedAt: 1,
                merchant: 1,
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $lookup: {
          from: 'productgroups',
          localField: 'items.groups.productGroupId',
          foreignField: '_id',
          as: 'groups',
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
      {
        $lookup: {
          from: 'drivers',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { tableId: '$tableId', branchId: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$tableId'] }, { $eq: ['$branchId', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'table',
        },
      },
      {
        $unwind: {
          path: '$table',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: '$branch' },
      { $unwind: '$orderCreatedBy' },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'items.productId',
        },
      },
      { $unwind: '$items.productId' },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
        },
      },
      {
        $unwind: {
          path: '$coupon',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          invoice: { $first: '$invoice' },
          status: { $first: '$status' },
          clientNotes: { $first: '$clientNotes' },
          merchantNotes: { $first: '$merchantNotes' },
          estimatedPreparationTime: { $first: '$estimatedPreparationTime' },
          localOrder: { $first: '$localOrder' },
          orderType: { $first: '$orderType' },
          orderRefId: { $first: '$orderRefId' },
          orderSeqId: { $first: '$orderSeqId' },
          rateStatus: { $first: '$rateStatus' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          groups: { $first: '$groups' },
          orderCreatedBy: { $first: '$orderCreatedBy' },
          branch: { $first: '$branch' },
          driverId: { $first: '$driverId' },
          driver: { $first: '$driver' },
          items: { $push: '$items' },
          tableId: { $first: '$tableId' },
          table: { $first: '$table' },
          couponId: { $first: '$couponId' },
          coupon: { $first: '$coupon' },
        },
      },
      {
        $project: {
          _id: 1,
          invoice: 1,
          status: 1,
          clientNotes: 1,
          merchantNotes: 1,
          estimatedPreparationTime: 1,
          localOrder: 1,
          orderType: 1,
          orderRefId: 1,
          orderSeqId: 1,
          rateStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          groups: 1,
          items: {
            count: 1,
            productId: 1,
            groups: 1,
          },
          orderCreatedBy: 1,
          merchant: '$branch.merchant',
          branch: 1,
          driverId: 1,
          driver: 1,
          tableId: 1,
          table: 1,
          couponId: 1,
          coupon: 1,
        },
      },
    ]);
    if (!order) throw new NotFoundException(ERROR_CODES.err_order_not_found);
    const options = order.groups.flatMap((group) => group.options);
    options.forEach((option) => {
      order.items.forEach((item) =>
        item.groups.forEach((group) => {
          const groupIndex = group.options.findIndex((element) => element._id.toString() === option._id.toString());
          if (groupIndex > -1) group.options[groupIndex] = option;
        }),
      );
    });
    return { ..._.omit(order, ['groups']) } as any;
  }

  async findOneDraftByBranchId(branchId: string, user?: any): Promise<IFindOneOrder> {
    const [order] = await this.draftOrderRepo._model.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(user?._id?.toString()),
          branchId: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branch: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$branch'],
                },
              },
            },
            {
              $lookup: {
                from: 'merchants',
                localField: 'merchantId',
                foreignField: '_id',
                as: 'merchant',
              },
            },
            { $unwind: '$merchant' },
            {
              $project: {
                _id: 1,
                name: 1,
                search: 1,
                mobile: 1,
                address: 1,
                cityId: 1,
                merchantId: 1,
                ownerId: 1,
                visibleToClients: 1,
                build_status: 1,
                release_status: 1,
                visibility_status: 1,
                notes: 1,
                isFreezing: 1,
                location: 1,
                locationDelta: 1,
                workingHours: 1,
                reservationsInstructions: 1,
                pickupInstructions: 1,
                deliveryInstructions: 1,
                translation: 1,
                isDeleted: 1,
                client_visits: 1,
                approvedBy: 1,
                inReview: 1,
                reservation_status: 1,
                createdAt: 1,
                updatedAt: 1,
                merchant: 1,
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $lookup: {
          from: 'productgroups',
          localField: 'items.groups.productGroupId',
          foreignField: '_id',
          as: 'groups',
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
      {
        $lookup: {
          from: 'drivers',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { tableId: '$tableId', branchId: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$tableId'] }, { $eq: ['$branchId', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'table',
        },
      },
      {
        $unwind: {
          path: '$table',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: '$branch' },
      { $unwind: '$orderCreatedBy' },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'items.productId',
        },
      },
      { $unwind: '$items.productId' },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
        },
      },
      {
        $unwind: {
          path: '$coupon',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          invoice: { $first: '$invoice' },
          status: { $first: '$status' },
          clientNotes: { $first: '$clientNotes' },
          merchantNotes: { $first: '$merchantNotes' },
          estimatedPreparationTime: { $first: '$estimatedPreparationTime' },
          localOrder: { $first: '$localOrder' },
          orderType: { $first: '$orderType' },
          orderRefId: { $first: '$orderRefId' },
          orderSeqId: { $first: '$orderSeqId' },
          rateStatus: { $first: '$rateStatus' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          groups: { $first: '$groups' },
          orderCreatedBy: { $first: '$orderCreatedBy' },
          branch: { $first: '$branch' },
          driverId: { $first: '$driverId' },
          driver: { $first: '$driver' },
          items: { $push: '$items' },
          tableId: { $first: '$tableId' },
          table: { $first: '$table' },
          couponId: { $first: '$couponId' },
          coupon: { $first: '$coupon' },
        },
      },
      {
        $project: {
          _id: 1,
          invoice: 1,
          status: 1,
          clientNotes: 1,
          merchantNotes: 1,
          estimatedPreparationTime: 1,
          localOrder: 1,
          orderType: 1,
          orderRefId: 1,
          orderSeqId: 1,
          rateStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          groups: 1,
          items: {
            count: 1,
            productId: 1,
            groups: 1,
          },
          orderCreatedBy: 1,
          merchant: '$branch.merchant',
          branch: 1,
          driverId: 1,
          driver: 1,
          tableId: 1,
          table: 1,
          couponId: 1,
          coupon: 1,
        },
      },
    ]);
    if (!order) throw new NotFoundException(ERROR_CODES.err_order_not_found);
    const options = order.groups.flatMap((group) => group.options);
    options.forEach((option) => {
      order.items.forEach((item) =>
        item.groups.forEach((group) => {
          const groupIndex = group.options.findIndex((element) => element._id.toString() === option._id.toString());
          if (groupIndex > -1) group.options[groupIndex] = option;
        }),
      );
    });
    return { ..._.omit(order, ['groups']) } as any;
  }

  async deleteOneDraftByBranchId(branchId: string, user?: any): Promise<any> {
    const [order] = await this.draftOrderRepo._model.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(user?._id?.toString()),
          branchId: new mongoose.Types.ObjectId(branchId),
        },
      },
    ]);
    if (!order) throw new NotFoundException(ERROR_CODES.err_order_not_found);
    await this.draftOrderRepo._model.deleteOne({
      clientId: new mongoose.Types.ObjectId(user?._id?.toString()),
      branchId: new mongoose.Types.ObjectId(branchId),
    });
    return { success: true };
  }

  async driverFindOneOrder(id: string, user?: any): Promise<IFindOneOrder> {
    const driverQuery = {};
    if (user?.job == MERCHANT_EMPLOYEE_JOB.DELIVERY) {
      driverQuery['driverId'] = new mongoose.Types.ObjectId(user?._id.toString());
      driverQuery['orderType'] = ORDER_TYPE.ORDER_STORE_DELIVERY;
    }
    const [order] = await this.orderRepo._model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id), ...driverQuery },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branch: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$branch'],
                },
              },
            },
            {
              $lookup: {
                from: 'merchants',
                localField: 'merchantId',
                foreignField: '_id',
                as: 'merchant',
              },
            },
            { $unwind: '$merchant' },
            {
              $project: {
                _id: 1,
                name: 1,
                search: 1,
                mobile: 1,
                address: 1,
                cityId: 1,
                merchantId: 1,
                ownerId: 1,
                visibleToClients: 1,
                build_status: 1,
                release_status: 1,
                visibility_status: 1,
                notes: 1,
                isFreezing: 1,
                location: 1,
                locationDelta: 1,
                workingHours: 1,
                reservationsInstructions: 1,
                pickupInstructions: 1,
                deliveryInstructions: 1,
                translation: 1,
                isDeleted: 1,
                client_visits: 1,
                approvedBy: 1,
                inReview: 1,
                reservation_status: 1,
                createdAt: 1,
                updatedAt: 1,
                merchant: 1,
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $lookup: {
          from: 'productgroups',
          localField: 'items.groups.productGroupId',
          foreignField: '_id',
          as: 'groups',
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
      {
        $lookup: {
          from: 'drivers',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { tableId: '$tableId', branchId: '$branchId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$tableId'] }, { $eq: ['$branchId', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'table',
        },
      },
      {
        $unwind: {
          path: '$table',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: '$branch' },
      { $unwind: '$orderCreatedBy' },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'items.productId',
        },
      },
      { $unwind: '$items.productId' },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
        },
      },
      {
        $unwind: {
          path: '$coupon',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          invoice: { $first: '$invoice' },
          status: { $first: '$status' },
          clientNotes: { $first: '$clientNotes' },
          merchantNotes: { $first: '$merchantNotes' },
          estimatedPreparationTime: { $first: '$estimatedPreparationTime' },
          localOrder: { $first: '$localOrder' },
          orderType: { $first: '$orderType' },
          orderRefId: { $first: '$orderRefId' },
          orderSeqId: { $first: '$orderSeqId' },
          rateStatus: { $first: '$rateStatus' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          groups: { $first: '$groups' },
          orderCreatedBy: { $first: '$orderCreatedBy' },
          branch: { $first: '$branch' },
          driverId: { $first: '$driverId' },
          driver: { $first: '$driver' },
          items: { $push: '$items' },
          tableId: { $first: '$tableId' },
          table: { $first: '$table' },
          couponId: { $first: '$couponId' },
          coupon: { $first: '$coupon' },
        },
      },
      {
        $project: {
          _id: 1,
          invoice: 1,
          status: 1,
          clientNotes: 1,
          merchantNotes: 1,
          estimatedPreparationTime: 1,
          localOrder: 1,
          orderType: 1,
          orderRefId: 1,
          orderSeqId: 1,
          rateStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          groups: 1,
          items: {
            count: 1,
            productId: 1,
            groups: 1,
          },
          orderCreatedBy: 1,
          merchant: '$branch.merchant',
          branch: 1,
          driverId: 1,
          driver: 1,
          tableId: 1,
          table: 1,
          couponId: 1,
          coupon: 1,
        },
      },
    ]);
    if (!order) throw new NotFoundException(ERROR_CODES.err_order_not_found);
    const options = order.groups.flatMap((group) => group.options);
    options.forEach((option) => {
      order.items.forEach((item) =>
        item.groups.forEach((group) => {
          const groupIndex = group.options.findIndex((element) => element._id.toString() === option._id.toString());
          if (groupIndex > -1) group.options[groupIndex] = option;
        }),
      );
    });
    return { ..._.omit(order, ['groups']) } as any;
  }

  /** Invoice PDF */
  buildTableBody(data: IFindOneOrder, columns, lang: string) {
    const body = [];
    body.push(columns);
    data.items.map(function (row, index) {
      const dataRow = [];
      dataRow.push(
        {
          text: `${row?.productId?.translation?.[0]?.name}
                    ${row?.groups
                      ?.map((group) => group?.options?.map((option) => option?.translation?.[0]?.name))
                      ?.join(',')}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: lang == 'ar' ? 'right' : 'left',
        },
        {
          text: `${data.items[index].count}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: lang == 'ar' ? 'right' : 'center',
        },
        {
          text: `${lang == 'ar' ? 'SAR' : ''} ${
            data.items[index].count * row.productId.price +
            row?.groups
              .map((group) =>
                group?.options?.reduce((acc: number, curr) => {
                  acc += curr?.extraPrice || 0;
                  return acc;
                }, 0),
              )
              .reduce((acc: number, curr) => {
                acc += curr || 0;
                return acc;
              }, 0)
          } ${lang == 'ar' ? ' ر.س ' : ''}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'right',
        },
      );
      body.push(dataRow);
    });

    return body;
  }

  table(data: IFindOneOrder, columns: Column, lang: string) {
    return {
      headerRows: 1,
      widths: lang === 'ar' ? [80, 80, '*'] : ['*', 80, 80],
      body: this.buildTableBody(data, columns, lang),
    };
  }

  async generateArabicInvoice(props: { id?: string; order?: IFindOneOrder } | any) {
    const order = props.order ? props.order : await this.findOne(props.id);

    const generatedTableArabic = this.table(
      order,
      [
        {
          text: ar.PDF_COL_TOTAL,
          style: 'header',
        },
        {
          text: ar.PDF_COL_COUNT,
          style: 'header',
        },
        {
          text: ar.PDF_COL_NAME,
          style: 'header',
        },
      ],
      'ar',
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PdfPrinter(fonts);
      const createdPdf = doc.createPdfKitDocument({
        content: [
          {
            columns: [
              {
                image: join(__dirname, 'public', 'IMG_6655.JPG'),
                width: 110,
                absolutePosition: { x: 10, y: 1 },
                alignment: 'left',
              },
              [
                {
                  text: ar.PDF_COL_INVOICE,
                  style: 'title',
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: `${order.orderRefId}`,
                          style: 'subTitleData',
                        },
                        {
                          text: ar.PDF_COL_INVOICE_NO,
                          style: 'subTitle',
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: `${order.createdAt}`,
                          style: 'subTitleData',
                        },
                        {
                          text: ar.PDF_COL_DATE_ISSUED,
                          style: 'subTitle',
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: 'PAID',
                          style: 'subTitleData',
                          color: 'green',
                        },
                        {
                          text: ar.PDF_COL_STATUS,
                          style: 'subTitle',
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          {
            columns: [
              {
                text: ar.PDF_COL_TO,
                style: 'transport',
              },
              {
                text: ar.PDF_COL_FROM,
                style: 'transport',
              },
            ],
          },
          {
            columns: [
              {
                text: `${order.orderCreatedBy.name}`,
                style: 'names',
              },
              {
                text: 'Shoppex.',
                style: 'names',
              },
            ],
          },
          '\n\n',
          {
            text: `${order.orderRefId} ${ar.PDF_COL_INVOICE_NO}`,
            alignment: 'center',
            bold: true,
            margin: [0, 10, 0, 10],
            fontSize: 15,
          },
          {
            layout: tableLayout,
            table: generatedTableArabic,
          },
          '\n',
          '\n\n',
          {
            layout: tableLayout,
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [
                  {
                    text: `SAR ${order?.invoice.charges[0].amount}`,
                    border: [false, true, false, true],
                    style: 'tableTwoCol',

                    fillColor: '#f5f5f5',
                  },
                  {
                    text: ar.PDF_COL_PAYMENT_SUB,
                    style: 'tableTwoCol',
                    border: [false, true, false, true],
                  },
                ],
                [
                  {
                    text: '15%',
                    style: 'tableTwoCol',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                  },
                  {
                    text: ar.PDF_COL_PAYMENT_TAX,
                    style: 'tableTwoCol',
                    border: [false, false, false, true],
                  },
                ],
                [
                  {
                    text: `SAR ${order?.invoice?.total.toFixed(2)}`,
                    style: 'totalPaymentStyle',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                  },
                  {
                    text: ar.PDF_COL_PAYMENT_TOTAL,
                    border: [false, false, false, true],
                    style: 'totalPaymentStyle',
                  },
                ],
              ],
            },
          },
          '\n\n',
          {
            text: ar.PDF_COL_NOTES,
            style: 'notesTitle',
          },
          {
            text: ar.PDF_TEXT_NOTE,
            style: 'notesText',
          },
          { qr: `https://api.dev.shoppex.net/order/gen-pdf/${order?._id}` },
        ],
        styles: pdfExtraStylesArabic,
        defaultStyle: {
          font: 'Tajawal',
        },
      });
      const chunks = [];

      createdPdf.on('data', (chunk) => {
        chunks.push(chunk);
      });

      createdPdf.on('end', () => {
        const data = Buffer.concat(chunks);
        resolve(data);
      });
      createdPdf.end();
    });
    return pdfBuffer;
  }

  async generateEnglishInvoice(id: string) {
    const order = await this.findOne(id);

    const table = this.table(
      order,
      [
        {
          text: en.PDF_COL_NAME,
          style: 'header',
        },
        {
          text: en.PDF_COL_COUNT,
          style: 'header',
        },
        {
          text: en.PDF_COL_TOTAL,
          style: 'header',
        },
      ],
      'en',
    );

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PdfPrinter(fonts);
      const createdPdf = doc.createPdfKitDocument({
        content: [
          {
            columns: [
              [
                {
                  text: en.PDF_COL_INVOICE,
                  style: 'title',
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: en.PDF_COL_INVOICE_NO,
                          style: 'subTitle',
                        },
                        {
                          text: `${order.orderRefId}`,
                          style: 'subTitleData',
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: en.PDF_COL_DATE_ISSUED,
                          style: 'subTitle',
                        },
                        {
                          text: `${order.createdAt}`,
                          style: 'subTitleData',
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: en.PDF_COL_STATUS,
                          style: 'subTitle',
                        },
                        {
                          text: 'PAID',
                          style: 'subTitleData',
                          color: 'green',
                        },
                      ],
                    },
                  ],
                },
              ],
              {
                image: join(__dirname, 'public', 'IMG_6655.JPG'),
                width: 110,
                absolutePosition: { x: 350, y: 1 },
                alignment: 'right',
              },
            ],
          },
          {
            columns: [
              {
                text: en.PDF_COL_FROM,
                style: 'transport',
              },
              {
                text: en.PDF_COL_TO,
                style: 'transport',
              },
            ],
          },
          {
            columns: [
              {
                text: 'Shoppex.',
                style: 'names',
              },
              {
                text: `${order.orderCreatedBy.name}`,
                style: 'names',
              },
            ],
          },
          '\n\n',
          {
            text: `${en.PDF_COL_INVOICE_NO} ${order.orderRefId}`,
            alignment: 'center',
            bold: true,
            margin: [0, 10, 0, 10],
            fontSize: 15,
          },
          {
            layout: tableLayout,
            table,
          },
          '\n',
          '\n\n',
          {
            layout: tableLayout,
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [
                  {
                    text: en.PDF_COL_PAYMENT_SUB,
                    style: 'tableTwoCol',
                    border: [false, true, false, true],
                  },
                  {
                    text: `SAR ${order?.invoice.charges[0]?.amount}`,
                    border: [false, true, false, true],
                    style: 'tableTwoCol',

                    fillColor: '#f5f5f5',
                  },
                ],
                [
                  {
                    text: en.PDF_COL_PAYMENT_TAX,
                    style: 'tableTwoCol',
                    border: [false, false, false, true],
                  },
                  {
                    text: '15%',
                    style: 'tableTwoCol',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                  },
                ],
                [
                  {
                    text: en.PDF_COL_PAYMENT_TOTAL,
                    border: [false, false, false, true],
                    style: 'totalPaymentStyle',
                  },
                  {
                    text: `SAR ${order?.invoice.total?.toFixed(2)}`,
                    style: 'totalPaymentStyle',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                  },
                ],
              ],
            },
          },
          '\n\n',
          {
            text: en.PDF_COL_NOTES,
            style: 'notesTitle',
          },
          {
            text: en.PDF_TEXT_NOTE,
            style: 'notesText',
          },
          {
            qr: `https://api.dev.shoppex.net/marketplace/orders/gen-invoice/${order?._id}`,
          },
        ],
        styles: pdfExtraStyles,
        defaultStyle: {
          font: 'Tajawal',
        },
      });
      const chunks = [];

      createdPdf.on('data', (chunk) => {
        chunks.push(chunk);
      });

      createdPdf.on('end', () => {
        const data = Buffer.concat(chunks);
        resolve(data);
      });
      createdPdf.end();
    });
    return pdfBuffer;
  }
}
