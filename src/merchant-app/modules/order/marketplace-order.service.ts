import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import mongoose from 'mongoose';

import { Order } from '../../../libs/database/src/lib/models/order/order.schema';
import ERROR_CODES from '../../../libs/utils/src/lib/errors_codes';
import { BranchService } from '../branch/branch.service';
import { ADD_ORDER } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { BRANCH_STATUS } from '../common/constants/branch.constants';
import {
  AMOUNT_TYPE,
  IFindOneOrder,
  ORDER_ACCEPTED_STATUS,
  ORDER_CANCELED_BY_CLIENT_STATUS,
  ORDER_PENDING_STATUS,
  ORDER_READY_STATUS,
  ORDER_TYPE,
} from '../common/constants/order.constants';
import { APPROVED_STATUS, PRODUCT_APPROVED_STATUS, PRODUCTION_STATUS } from '../common/constants/product';
import {
  CREATE_ORDER_NOTIFICATION_PROCESS,
  CREATE_ORDER_PROCESSOR,
  NOTIFICATION_QUEUE,
  ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS,
  ORDER_QUEUE,
} from '../common/constants/queue.constants';
import {
  AddressRepository,
  BranchRepository,
  CounterRepository,
  CouponRepository,
  DraftOrder,
  MerchantRepository,
  OrderRepository,
  ProductRepository,
  TableRepository,
} from '../models';
import { DraftOrderRepository } from '../models/order/order-draft.repository';
import { SettingRepository } from '../models/setting/setting.repository';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { OrderSocketGateway } from '../socket/order.socket.gateway';
import { EstimateStoreOrderFeesDto } from './dto/client-estimate-store-order-fees.dto';
import { GetAllClientHistoryDto } from './dto/create-client-order-history.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { findAllOrderQueryDto } from './dto/find-all-order.dto';
import { OrderSharedService } from './shared/order.shared.service';

@Injectable()
export class MarketplaceOrderService extends OrderSharedService {
  constructor(
    @InjectQueue(ORDER_QUEUE) private readonly orderQueue: Queue,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    private readonly orderRepository: OrderRepository,
    private readonly branchService: BranchService,
    private readonly prodcutRepository: ProductRepository,
    private readonly counterRepository: CounterRepository,
    private readonly orderSocketGateway: OrderSocketGateway,
    private readonly merchantGateWay: MerchantGateWay,
    private readonly branchRepository: BranchRepository,
    private readonly settingRepository: SettingRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly tableRepository: TableRepository,
    private readonly couponRepository: CouponRepository,
    private readonly addressRepository: AddressRepository,
    private readonly draftOrderRepository: DraftOrderRepository,
  ) {
    super(orderRepository, prodcutRepository, draftOrderRepository);
  }

  async create(createOrderDto: CreateOrderDto | any, user: any, lang?: string) {
    const branchDetails = await this.branchService.getOneBranch(createOrderDto.branchId);
    if (!branchDetails?.visibility_status) throw new BadRequestException(ERROR_CODES.err_branch_currently_offline);
    if (branchDetails?.status != BRANCH_STATUS.APPROVED_STATUS)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_approved);
    if (createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY && !branchDetails?.self_delivery)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_has_self_delivery);

    const { _id, name } = user;
    const { totalPrice, estimatedPreparationTime, items } = await this.prepareCreateOrder(createOrderDto);

    let taxAmount = 15;
    let taxType = AMOUNT_TYPE.PERCENTAGE;

    const shoppexOrderTaxSetting = await this.settingRepository.getOne({ modelName: 'ShoppexOrderTax' });

    if (shoppexOrderTaxSetting) {
      taxAmount =
        shoppexOrderTaxSetting?.type == AMOUNT_TYPE.PERCENTAGE
          ? shoppexOrderTaxSetting?.amount / 100
          : shoppexOrderTaxSetting?.amount;
      taxType = shoppexOrderTaxSetting?.type == AMOUNT_TYPE.PERCENTAGE ? AMOUNT_TYPE.PERCENTAGE : AMOUNT_TYPE.FIXED;
    }

    const totalAmountAfterTax = totalPrice + totalPrice * (taxAmount || 0.15);

    const merchant = await this.merchantRepository.getOne({ _id: branchDetails.merchantId });

    const marketplaceOrderPriceSetting =
      merchant?.lowestPriceToOrder > 0
        ? merchant?.lowestPriceToOrder
        : (
            await this.settingRepository.getOne({
              modelName: 'LowestMarketplaceOrderPrice',
            })
          )?.amount || 25;

    if (totalAmountAfterTax < marketplaceOrderPriceSetting) {
      throw new BadRequestException(ERROR_CODES.err_order_price_is_less_than_minimum, {
        description: lang == 'ar' ? marketplaceOrderPriceSetting.toString() : marketplaceOrderPriceSetting.toString(),
      });
    }

    const newOrder = new Order();
    newOrder.branchId = new mongoose.Types.ObjectId(createOrderDto.branchId);
    newOrder.clientId = new mongoose.Types.ObjectId(_id);
    newOrder.orderCreatedBy = new mongoose.Types.ObjectId(_id);
    newOrder.orderType = createOrderDto.orderType;

    if (_id && [ORDER_TYPE.ORDER_DELIVERY].includes(createOrderDto.orderType as ORDER_TYPE)) {
      const addresses = await this.addressRepository.listAddresses(_id);
      const activeAddress = addresses?.find((ele) => {
        return ele?.is_active;
      });
      if (activeAddress) newOrder.address = activeAddress;
    }

    for (let index = 0; index < items.length; index++) {
      const currentProduct = await this.prodcutRepository.getOne(
        {
          _id: new mongoose.Types.ObjectId(items[index].productId),
        },
        { lean: true, new: true },
      );

      if (currentProduct && currentProduct?.build_status != PRODUCT_APPROVED_STATUS) {
        throw new BadRequestException(ERROR_CODES.err_order_product_is_not_approved, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      if (currentProduct && currentProduct?.release_status != PRODUCTION_STATUS) {
        throw new BadRequestException(ERROR_CODES.err_order_product_is_not_ready_for_production, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      if (currentProduct && currentProduct?.remainingQuantity < items[index]?.count) {
        throw new BadRequestException(ERROR_CODES.err_product_quantity_not_enough, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      if (
        currentProduct &&
        currentProduct?.remainingQuantity - items[index]?.count <= Math.round(currentProduct?.quantity / 3)
      ) {
        await this.notificationQueue.add(
          ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS,
          { ...currentProduct, remainingQuantity: currentProduct.remainingQuantity - items[index]?.count },
          {
            attempts: 3,
          },
        );
      }
    }

    for (let index = 0; index < items.length; index++) {
      await this.prodcutRepository._model.updateOne(
        { _id: new mongoose.Types.ObjectId(items[index].productId) },
        { $inc: { remainingQuantity: -items[index].count } },
      );
    }

    const checkCouponIsValid = createOrderDto?.couponCode
      ? await this.couponRepository.checkCouponIsValid({
          clientId: user._id.toString(),
          code: createOrderDto.couponCode,
          branchId: createOrderDto.branchId,
          orderType: createOrderDto.orderType,
          items: createOrderDto.items,
        })
      : null;

    newOrder.items = items;
    newOrder.invoice = {
      total: +totalAmountAfterTax.toFixed(2),
      charges: [
        {
          name: 'Total Items',
          amount: +totalPrice.toFixed(2),
          type: AMOUNT_TYPE.FIXED,
          translation: [
            {
              _lang: 'ar',
              name: 'مجموع العناصر',
            },
          ],
        },
        {
          name: 'Tax',
          amount: shoppexOrderTaxSetting?.amount || 15,
          type: taxType,
          translation: [
            {
              _lang: 'ar',
              name: 'الضريبة المضافة',
            },
          ],
        },
      ],
    };

    if (createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY) {
      let minimum_delivery_price = merchant?.minimum_delivery_price;
      if (!minimum_delivery_price) {
        minimum_delivery_price =
          (
            await this.settingRepository.getOne({
              modelName: 'MerchantMinimumDeliveryPriceToOrder',
            })
          )?.amount || 25;
      }

      if (totalAmountAfterTax < minimum_delivery_price) {
        throw new BadRequestException(ERROR_CODES.err_order_price_is_less_than_minimum_delivery_price, {
          description: lang == 'ar' ? minimum_delivery_price.toString() : minimum_delivery_price.toString(),
        });
      }

      const store_delivery_fee = branchDetails?.store_delivery_fee;
      if (store_delivery_fee) {
        newOrder.invoice.charges.push(store_delivery_fee);
        newOrder.invoice.total =
          newOrder.invoice.total +
          (store_delivery_fee.type == AMOUNT_TYPE.FIXED
            ? store_delivery_fee?.amount
            : totalPrice * (store_delivery_fee?.amount / 100));
      }
    }

    if (
      createOrderDto?.tableId &&
      [ORDER_TYPE.ORDER_DINING, ORDER_TYPE.ORDER_BOOK, ORDER_TYPE.ORDER_OFFLINE_BOOK].includes(
        createOrderDto?.orderType as ORDER_TYPE,
      )
    ) {
      const table = await this.tableRepository.getOne(
        {
          _id: new mongoose.Types.ObjectId(createOrderDto?.tableId),
          branchId: new mongoose.Types.ObjectId(createOrderDto?.branchId),
        },
        { lean: true },
      );

      if (!table) {
        throw new BadRequestException(ERROR_CODES.err_table_not_found);
      }

      newOrder.tableId = new mongoose.Types.ObjectId(createOrderDto?.tableId);
    }

    newOrder.estimatedPreparationTime = estimatedPreparationTime;
    newOrder.orderRefId = await this._generateOrderRefId();
    newOrder.orderSeqId = await this.counterRepository.counter('orderCounter');
    newOrder.clientNotes = createOrderDto?.clientNotes;
    newOrder.paymentType = createOrderDto?.paymentType;

    try {
      const createdOrder = await this.orderRepository.create(newOrder);

      const order = await this.findOne(createdOrder._id.toString());
      await this.notificationQueue.add(CREATE_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });
      await this.orderSocketGateway.handleClientCreateOrderToBranch(order as unknown as Order);

      await this.orderQueue.add(CREATE_ORDER_PROCESSOR, createdOrder, {
        delay: 3 * 1000 * 60,
        jobId: `${createdOrder._id}-${name}`,
      });

      const addOrderActivity = new Activity();
      addOrderActivity.order = order._id.toString();
      addOrderActivity.merchant = order.merchant._id.toString();
      addOrderActivity.actor = user._id;
      addOrderActivity.scope = 'Client';
      this.activitiesClient.emit(ADD_ORDER, addOrderActivity);

      // delete draft order if exists
      await this.draftOrderRepository._model.deleteMany({
        branchId: new mongoose.Types.ObjectId(createOrderDto.branchId),
        clientId: new mongoose.Types.ObjectId(_id),
      });

      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createOrUpdateDraft(createOrderDto: CreateOrderDto | any, user: any, lang?: string) {
    const branchDetails = await this.branchService.getOneBranch(createOrderDto.branchId);
    if (!branchDetails?.visibility_status) throw new BadRequestException(ERROR_CODES.err_branch_currently_offline);
    if (branchDetails?.status != BRANCH_STATUS.APPROVED_STATUS)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_approved);
    if (createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY && !branchDetails?.self_delivery)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_has_self_delivery);

    const { _id, name } = user;
    const { totalPrice, estimatedPreparationTime, items } = await this.prepareCreateOrder(createOrderDto);

    let taxAmount = 15;
    let taxType = AMOUNT_TYPE.PERCENTAGE;

    const shoppexOrderTaxSetting = await this.settingRepository.getOne({ modelName: 'ShoppexOrderTax' });

    if (shoppexOrderTaxSetting) {
      taxAmount =
        shoppexOrderTaxSetting?.type == AMOUNT_TYPE.PERCENTAGE
          ? shoppexOrderTaxSetting?.amount / 100
          : shoppexOrderTaxSetting?.amount;
      taxType = shoppexOrderTaxSetting?.type == AMOUNT_TYPE.PERCENTAGE ? AMOUNT_TYPE.PERCENTAGE : AMOUNT_TYPE.FIXED;
    }

    const totalAmountAfterTax = totalPrice + totalPrice * (taxAmount || 0.15);

    const merchant = await this.merchantRepository.getOne({ _id: branchDetails.merchantId });

    const marketplaceOrderPriceSetting =
      merchant?.lowestPriceToOrder > 0
        ? merchant?.lowestPriceToOrder
        : (
            await this.settingRepository.getOne({
              modelName: 'LowestMarketplaceOrderPrice',
            })
          )?.amount || 25;

    if (totalAmountAfterTax < marketplaceOrderPriceSetting) {
      throw new BadRequestException(ERROR_CODES.err_order_price_is_less_than_minimum, {
        description: lang == 'ar' ? marketplaceOrderPriceSetting.toString() : marketplaceOrderPriceSetting.toString(),
      });
    }

    const newOrder = new DraftOrder();
    newOrder.branchId = new mongoose.Types.ObjectId(createOrderDto.branchId);
    newOrder.clientId = new mongoose.Types.ObjectId(_id);
    newOrder.orderCreatedBy = new mongoose.Types.ObjectId(_id);
    newOrder.orderType = createOrderDto.orderType;

    if (_id && [ORDER_TYPE.ORDER_DELIVERY].includes(createOrderDto.orderType as ORDER_TYPE)) {
      const addresses = await this.addressRepository.listAddresses(_id);
      const activeAddress = addresses?.find((ele) => {
        return ele?.is_active;
      });
      if (activeAddress) newOrder.address = activeAddress;
    }

    for (let index = 0; index < items.length; index++) {
      const currentProduct = await this.prodcutRepository.getOne(
        {
          _id: new mongoose.Types.ObjectId(items[index].productId),
        },
        { lean: true, new: true },
      );

      if (currentProduct && currentProduct?.build_status != PRODUCT_APPROVED_STATUS) {
        throw new BadRequestException(ERROR_CODES.err_order_product_is_not_approved, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      if (currentProduct && currentProduct?.release_status != PRODUCTION_STATUS) {
        throw new BadRequestException(ERROR_CODES.err_order_product_is_not_ready_for_production, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      if (currentProduct && currentProduct?.remainingQuantity < items[index]?.count) {
        throw new BadRequestException(ERROR_CODES.err_product_quantity_not_enough, {
          description: lang == 'ar' ? currentProduct.name : currentProduct.translation?.[0]?.name,
        });
      }

      // if (
      //   currentProduct &&
      //   currentProduct?.remainingQuantity - items[index]?.count <= Math.round(currentProduct?.quantity / 3)
      // ) {
      //   await this.notificationQueue.add(
      //     ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS,
      //     { ...currentProduct, remainingQuantity: currentProduct.remainingQuantity - items[index]?.count },
      //     {
      //       attempts: 3,
      //     },
      //   );
      // }
    }

    const checkCouponIsValid = createOrderDto?.couponCode
      ? await this.couponRepository.checkCouponIsValid({
          clientId: user._id.toString(),
          code: createOrderDto.couponCode,
          branchId: createOrderDto.branchId,
          orderType: createOrderDto.orderType,
          items: createOrderDto.items,
        })
      : null;

    newOrder.items = items;
    newOrder.invoice = {
      total: +totalAmountAfterTax.toFixed(2),
      charges: [
        {
          name: 'Total Items',
          amount: +totalPrice.toFixed(2),
          type: AMOUNT_TYPE.FIXED,
          translation: [
            {
              _lang: 'ar',
              name: 'مجموع العناصر',
            },
          ],
        },
        {
          name: 'Tax',
          amount: shoppexOrderTaxSetting?.amount || 15,
          type: taxType,
          translation: [
            {
              _lang: 'ar',
              name: 'الضريبة المضافة',
            },
          ],
        },
      ],
    };

    if (createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY) {
      let minimum_delivery_price = merchant?.minimum_delivery_price;
      if (!minimum_delivery_price) {
        minimum_delivery_price =
          (
            await this.settingRepository.getOne({
              modelName: 'MerchantMinimumDeliveryPriceToOrder',
            })
          )?.amount || 25;
      }

      if (totalAmountAfterTax < minimum_delivery_price) {
        throw new BadRequestException(ERROR_CODES.err_order_price_is_less_than_minimum_delivery_price, {
          description: lang == 'ar' ? minimum_delivery_price.toString() : minimum_delivery_price.toString(),
        });
      }

      const store_delivery_fee = branchDetails?.store_delivery_fee;
      if (store_delivery_fee) {
        newOrder.invoice.charges.push(store_delivery_fee);
        newOrder.invoice.total =
          newOrder.invoice.total +
          (store_delivery_fee.type == AMOUNT_TYPE.FIXED
            ? store_delivery_fee?.amount
            : totalPrice * (store_delivery_fee?.amount / 100));
      }
    }

    newOrder.estimatedPreparationTime = estimatedPreparationTime;
    newOrder.orderRefId = await this._generateOrderRefId();
    newOrder.orderSeqId = await this.counterRepository.counter('orderCounter');
    newOrder.clientNotes = createOrderDto?.clientNotes;
    newOrder.paymentType = createOrderDto?.paymentType;

    try {
      const isDraftOrderExists = await this.draftOrderRepository.getOne(
        {
          branchId: new mongoose.Types.ObjectId(createOrderDto.branchId),
          clientId: new mongoose.Types.ObjectId(_id),
        },
        { lean: true },
      );

      const createdDraftOrder = !isDraftOrderExists
        ? await this.draftOrderRepository.create(newOrder)
        : await this.draftOrderRepository.updateById(
            isDraftOrderExists._id.toString(),
            {
              ...newOrder,
            },
            { new: true },
            {},
          );

      const draftOrder = await this.findOneDraftById(createdDraftOrder._id.toString());

      return draftOrder;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(user: any, query: findAllOrderQueryDto) {
    const { limit, order, page, sortBy, status, paginate } = query || {};
    const statusMatch = status ? { status: { $in: status } } : {};

    let paginationArray = [];

    if (!isNaN(page) && !isNaN(limit)) {
      paginationArray = [
        {
          $skip: page <= 0 ? 0 : limit * page,
        },
        {
          $limit: limit,
        },
      ];
    }

    const orders = await this.orderRepository.aggregate(
      [
        {
          $match: {
            ...statusMatch,
            clientId: new mongoose.Types.ObjectId(user._id),
            isDeleted: false,
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
                    $and: [{ $eq: ['$_id', '$$branch'] }, { $eq: ['$isDeleted', false] }],
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
                  translation: 1,
                  mobile: 1,
                  merchantId: 1,
                  ownerId: 1,
                  merchant: {
                    _id: 1,
                    name: 1,
                    translation: 1,
                    logo: 1,
                  },
                },
              },
            ],
            as: 'branch',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'products',
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
        { $unwind: '$branch' },
        {
          $project: {
            orderRefId: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            branch: {
              _id: 1,
              name: 1,
              translation: 1,
            },
            merchant: {
              _id: '$branch.merchant._id',
              name: '$branch.merchant.name',
              translation: '$branch.merchant.translation',
              logo: '$branch.merchant.logo',
            },
            invoice: {
              total: 1,
              charges: 1,
            },
            products: {
              _id: 1,
              name: 1,
              translation: 1,
              price: 1,
              preparationTime: 1,
              calories: 1,
            },
            orderCreatedBy: {
              _id: 1,
              name: 1,
              type: 1,
            },
          },
        },
        {
          $sort: !sortBy || !order ? { updatedAt: -1, createdAt: -1 } : { [sortBy]: order },
        },
        ...paginationArray,
      ],
      // {
      //   limit,
      //   sort: { [sortBy]: order },
      //   page,
      //   paginate,
      // },
    );

    return orders;
  }

  cancelOrder(orderId: string, user: any) {
    const { _id: clientId } = user;

    return this.orderRepository.updateOne(
      {
        isDeleted: false,
        _id: orderId,
        clientId,
      },
      { status: ORDER_CANCELED_BY_CLIENT_STATUS },
      { new: true, lean: true },
    );
  }

  async findLastOrder(user: any) {
    const result = await this.orderRepository.getOne(
      {
        isDeleted: false,
        clientId: new mongoose.Types.ObjectId(user._id),
        status: { $in: [ORDER_PENDING_STATUS, ORDER_ACCEPTED_STATUS, ORDER_READY_STATUS] },
      },
      {
        sort: {
          updatedAt: 'desc',
        },
        populate: [
          {
            path: 'branchId',
            select: '_id name mobile translation merchantId ownerId',
            populate: [
              {
                path: 'merchantId',
                model: 'Merchant',
                select: '_id name translation logo',
              },
            ],
          },
          {
            path: 'items.productId',
            select: '_id name price preparationTime calories',
          },
          {
            path: 'items.groups.productGroupId',
            select: '_id name',
          },
          {
            path: 'orderCreatedBy',
            select: '_id name type',
          },
        ],
      },
    );
    return result || {};
  }

  getClientOrderingHistory(user: any, query: GetAllClientHistoryDto | any) {
    return this.orderRepository.getClientOrderingHistory(user, query);
  }

  async chargesOrderFees(user: any, query: EstimateStoreOrderFeesDto | any) {
    const { longitude, latitude, branchId, merchantId, orderType, paymentType, coupons } = query;

    if (orderType == ORDER_TYPE.ORDER_STORE_DELIVERY && (isNaN(longitude) || isNaN(latitude))) {
      throw new BadRequestException(ERROR_CODES.err_client_longitude_latitude_must_be_send);
    }

    const [branch] = await this.branchRepository._model.aggregate([
      {
        $geoNear:
          !isNaN(longitude) && !isNaN(latitude)
            ? {
                near: { type: 'Point', coordinates: [longitude, latitude] },
                distanceField: 'dist.calculated',
                query: {
                  _id: new mongoose.Types.ObjectId(branchId),
                },
                includeLocs: 'dist.location',
                spherical: true,
              }
            : {
                near: { type: 'Point', coordinates: [0, 0] },
                distanceField: 'dist.calculated',
                includeLocs: 'dist.location',
                spherical: true,
              },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 1,
          self_delivery: 1,
          store_delivery_fee: 1,
          fees_delivery_per_kilometer: 1,
          distance: { $round: ['$dist.calculated', 2] },
        },
      },
    ]);

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId) });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    let merchant_lowest_price_to_order = merchant?.lowestPriceToOrder;

    if (!merchant_lowest_price_to_order) {
      merchant_lowest_price_to_order =
        (
          await this.settingRepository.getOne({
            modelName: 'MerchantLowestPriceToOrder',
          })
        )?.amount || 25;
    }

    let minimum_delivery_price = merchant?.minimum_delivery_price;

    if (!minimum_delivery_price) {
      minimum_delivery_price =
        (
          await this.settingRepository.getOne({
            modelName: 'MerchantMinimumDeliveryPriceToOrder',
          })
        )?.amount || 25;
    }

    if (orderType == ORDER_TYPE.ORDER_STORE_DELIVERY && !branch?.self_delivery)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_has_self_delivery);

    // if (orderType == ORDER_TYPE.ORDER_STORE_DELIVERY) {
    //   total_store_fees +=
    //     (branch?.store_delivery_fee?.amount || 0) +
    //     (branch?.fees_delivery_per_kilometer || 0) * ((branch?.distance || 0) / 1000);
    // }

    const shoppexOrderTax = {
      name: 'Tax',
      amount: 15,
      type: AMOUNT_TYPE.PERCENTAGE,
      translation: [
        {
          _lang: 'ar',
          name: 'الضريبة المضافة',
        },
      ],
    };

    return {
      distance_per_meter: !isNaN(longitude) && !isNaN(latitude) ? branch?.distance : 0,
      shoppex_order_tax: shoppexOrderTax,
      store_delivery_fee: branch?.store_delivery_fee,
      fees_delivery_per_kilometer: branch?.fees_delivery_per_kilometer || 0,
      minimum_delivery_price: merchant?.minimum_delivery_price || 0,
      merchant_lowest_price_to_order,
      // total_store_fees,
    };
  }
}
