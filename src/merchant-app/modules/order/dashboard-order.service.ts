import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import mongoose, { Types } from 'mongoose';

import { Order } from '../../../libs/database/src/lib/models/order/order.schema';
import { ERROR_CODES } from '../../../libs/utils/src';
import { BranchService } from '../branch/branch.service';
import { UPDATE_ORDER } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { BRANCH_STATUS } from '../common/constants/branch.constants';
import { MERCHANT_EMPLOYEE_JOB } from '../common/constants/merchant-employee';
import {
  AMOUNT_TYPE,
  ORDER_ACCEPTED_STATUS,
  ORDER_CANCELED_BY_CLIENT_STATUS,
  ORDER_CANCELED_BY_EMPLOYEE_STATUS,
  ORDER_CANCELED_BY_MERCHANT_STATUS,
  ORDER_CANCELED_BY_OPERATION_STATUS,
  ORDER_CANCELED_BY_SHOPPEX_STATUS,
  ORDER_DELIVERED_STATUS,
  ORDER_EXPIRED_STATUS,
  ORDER_PENDING_STATUS,
  ORDER_READY_STATUS,
  ORDER_REJECTED_BY_EMPLOYEE_STATUS,
  ORDER_REJECTED_BY_SHOPPEX_STATUS,
  ORDER_STATUS,
  ORDER_TYPE,
} from '../common/constants/order.constants';
import { PRODUCT_APPROVED_STATUS, PRODUCTION_STATUS } from '../common/constants/product';
import {
  ACCEPT_ORDER_NOTIFICATION_PROCESS,
  ACCEPT_ORDER_PROCESSOR,
  CANCEL_ORDER_NOTIFICATION_PROCESS,
  CREATE_ORDER_NOTIFICATION_PROCESS,
  DELIVERED_ORDER_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS,
  ORDER_QUEUE,
  READY_ORDER_NOTIFICATION_PROCESS,
  READY_ORDER_PROCESSOR,
  REJECTED_ORDER_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { STATUS } from '../common/constants/status.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import { MailService } from '../mail/mail.service';
import {
  AddressRepository,
  ClientRepository,
  CounterRepository,
  CouponRepository,
  MerchantEmployee,
  MerchantEmployeeRepository,
  MerchantRepository,
  OrderRepository,
  Owner,
  ProductRepository,
  ShoppexEmployee,
  TableRepository,
} from '../models';
import { DriverRepository } from '../models/driver/driver.repository';
import { SettingRepository } from '../models/setting/setting.repository';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { OrderSocketGateway } from '../socket/order.socket.gateway';
import { OrderDeliveredEvent, OrderReadyEvent } from '../transactions/events/orders.events';
import { DashboardCreateOrderDto } from './dto/dashboard-create-order.dto';
import { FindAllClientsClusteringDto } from './dto/dashboard-find-all-client-clustering.dto';
import { DashboardOrderQueryDto } from './dto/dashboard-orders-query.dto';
import { DashboardOrderAcceptedDto } from './dto/order-accepted.dto';
import { DashboardOrderRejectDto } from './dto/order-rejected.dto';
import { DashboardOrderFactoryService } from './factory/dashboard-order.factory.service';
import { OrderSharedService } from './shared/order.shared.service';

@Injectable()
export class DashboardOrderService extends OrderSharedService {
  constructor(
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    @InjectQueue(ORDER_QUEUE) private readonly orderQueue: Queue,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly counterRepository: CounterRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly orderSocketGateway: OrderSocketGateway,
    private readonly mailService: MailService,
    private readonly factoryService: DashboardOrderFactoryService,
    private readonly merchantGateWay: MerchantGateWay,
    private readonly branchService: BranchService,
    private readonly merchantEmployeeRepository: MerchantEmployeeRepository,
    private readonly settingRepository: SettingRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly tableRepository: TableRepository,
    private readonly couponRepository: CouponRepository,
    private readonly driverRepository: DriverRepository,
    private readonly addressRepository: AddressRepository,
  ) {
    super(orderRepository, productRepository);
  }

  private logger = new Logger(DashboardOrderService.name);

  async create(user: any, createOrderDto: DashboardCreateOrderDto, lang?: string) {
    const { totalPrice, estimatedPreparationTime, items } = await this.prepareCreateOrder(createOrderDto);
    const totalAmountAfterTax = totalPrice + totalPrice * 0.15;
    const newOrder = new Order();
    newOrder.branchId = new mongoose.Types.ObjectId(createOrderDto.branchId);
    newOrder.orderCreatedBy = new mongoose.Types.ObjectId(user._id);

    const branchDetails = await this.branchService.getOneBranch(createOrderDto.branchId);
    if (!branchDetails?.visibility_status) throw new BadRequestException(ERROR_CODES.err_branch_currently_offline);
    if (branchDetails?.status != BRANCH_STATUS.APPROVED_STATUS)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_approved);
    if (createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY && !branchDetails?.self_delivery)
      throw new BadRequestException(ERROR_CODES.err_order_branch_is_not_has_self_delivery);

    const merchant = await this.merchantRepository.getOne({ _id: branchDetails.merchantId });

    for (let index = 0; index < items.length; index++) {
      const currentProduct = await this.productRepository.getOne(
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
      await this.productRepository._model.updateOne(
        { _id: new mongoose.Types.ObjectId(items[index].productId) },
        { $inc: { remainingQuantity: -items[index].count } },
      );
    }

    const checkCouponIsValid = createOrderDto?.couponCode
      ? await this.couponRepository.checkCouponIsValid({
          clientId: createOrderDto.clientId,
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
          amount: 15,
          type: AMOUNT_TYPE.PERCENTAGE,
          translation: [
            {
              _lang: 'ar',
              name: 'الضريبة المضافة',
            },
          ],
        },
      ],
    };

    if (checkCouponIsValid) {
      const couponDiscount = await this.couponRepository.calculateCouponDiscount(
        createOrderDto?.couponCode,
        +totalPrice.toFixed(2),
      );
      newOrder.invoice.charges.push(couponDiscount);
      newOrder.invoice.total = newOrder.invoice.total - couponDiscount.amount;
    }

    if (
      createOrderDto?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY ||
      createOrderDto?.orderType == ORDER_TYPE.ORDER_DELIVERY
    ) {
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

      const store_delivery_fee = branchDetails?.store_delivery_fee || {
        name: 'خدمة التوصيل من الفرع',
        amount: 10,
        type: AMOUNT_TYPE.FIXED,
        translation: [
          {
            name: 'store delivery fee',
            _lang: 'en',
          },
        ],
      };

      if (store_delivery_fee) {
        newOrder.invoice.charges.push(store_delivery_fee);
        newOrder.invoice.total =
          newOrder.invoice.total +
          (store_delivery_fee.type == AMOUNT_TYPE.PERCENTAGE
            ? totalPrice * (store_delivery_fee?.amount / 100)
            : store_delivery_fee?.amount);
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
    newOrder.localOrder = true;
    newOrder.orderType = createOrderDto?.orderType;
    newOrder.status = ORDER_ACCEPTED_STATUS;
    newOrder.clientId = createOrderDto?.clientId ? new mongoose.Types.ObjectId(createOrderDto.clientId) : undefined;
    newOrder.couponId = checkCouponIsValid && checkCouponIsValid?._id ? checkCouponIsValid._id : undefined;

    if (createOrderDto?.clientId && [ORDER_TYPE.ORDER_DELIVERY].includes(createOrderDto.orderType as ORDER_TYPE)) {
      const addresses = await this.addressRepository.listAddresses(createOrderDto.clientId);
      const activeAddress = addresses?.find((ele) => {
        return ele?.active;
      });
      if (activeAddress) newOrder.address = activeAddress;
    }

    try {
      const createdOrder = await this.orderRepository.create(newOrder);
      if (!createdOrder) throw new BadRequestException(ERROR_CODES.err_failed_to_create_order);
      const order = await this.findOne(createdOrder._id.toString());

      await this.notificationQueue.add(CREATE_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderAcceptedEvent, orderActivityEvent } = this.factoryService.createNewOrderEvent(
        user,
        order,
        totalPrice,
      );
      this.activitiesClient.emit('addOrder', orderActivityEvent);
      this.eventEmitter.emit('orderAccepted', orderAcceptedEvent);
      return order;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  findAll(query: DashboardOrderQueryDto, branchId?: string) {
    return this.orderRepository.listOrdersDashboard(query, branchId);
  }

  async orderDetails(user: any, orderId: string) {
    const order = await this.findOne(orderId, user);

    const orderViewActivity = new Activity();
    orderViewActivity.scope = 'MerchantEmployee';
    orderViewActivity.actor = user._id;
    orderViewActivity.order = order._id.toString();
    orderViewActivity.merchant = order.merchant._id.toString();
    orderViewActivity.status = order.status;
    this.activitiesClient.emit('updateOrder', orderViewActivity);

    return order;
  }

  async acceptOrder(user: any, orderId: string, dashboardOrderAcceptedDto: DashboardOrderAcceptedDto) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());
      if (
        currentOrder?.orderType == ORDER_TYPE.ORDER_DELIVERY ||
        currentOrder?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY
      ) {
        let driver = dashboardOrderAcceptedDto?.driverId
          ? await this.driverRepository.getOne({
              _id: new mongoose.Types.ObjectId(dashboardOrderAcceptedDto.driverId),
              // branchesIds: { $in: [currentBranch._id] },
              isDeleted: false,
            })
          : // try get nearest driver from branch location
            await this.driverRepository.getNearestDriver(
              currentBranch.location.coordinates[0],
              currentBranch.location.coordinates[1],
            );

        if (!driver) {
          // throw new BadRequestException(ERROR_CODES.err_order_must_has_driver_for_self_delivery);
          throw new NotFoundException(ERROR_CODES.err_order_driver_not_found);
        }

        // if (driver?.job != MERCHANT_EMPLOYEE_JOB.DELIVERY) {
        //   throw new BadRequestException(ERROR_CODES.err_order_driver_must_be_delivery_job);
        // }

        dashboardOrderAcceptedDto['driverId'] = new mongoose.Types.ObjectId(dashboardOrderAcceptedDto.driverId) as any;

        dashboardOrderAcceptedDto['deliveryProviderId'] = new mongoose.Types.ObjectId(
          driver.deliveryProviderId.toString(),
        ) as any;
      } else {
        delete dashboardOrderAcceptedDto?.driverId;
      }

      const updatedOrder = await this.updateOrderStatus(
        orderId,
        ORDER_ACCEPTED_STATUS,
        [ORDER_PENDING_STATUS, ORDER_ACCEPTED_STATUS],
        { ...dashboardOrderAcceptedDto },
      );
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      await this.orderQueue.add(ACCEPT_ORDER_PROCESSOR, updatedOrder, {
        delay: 180 * 1000 * 60,
        jobId: `${updatedOrder['_id']}-${updatedOrder.branchId['name']}`,
      });

      const order = await this.findOne(orderId);

      await this.orderSocketGateway.handleUpdateOrderToClient({
        _id: order._id.toString(),
        branch: order.branch,
        orderCreatedBy: order.orderCreatedBy,
        items: order.items,
        invoice: order.invoice,
        status: order.status,
        orderRefId: order.orderRefId,
        orderType: order.orderType,
      });

      await this.notificationQueue.add(ACCEPT_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderAcceptedEvent, orderActivityEvent } = this.factoryService.acceptOrderEvent(user, updatedOrder);

      this.eventEmitter.emit('orderAccepted', orderAcceptedEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async cancelOrder(user: any, orderId: string) {
    const cancelByMap = {
      [MerchantEmployee.name]: ORDER_CANCELED_BY_EMPLOYEE_STATUS,
      [Owner.name]: ORDER_CANCELED_BY_EMPLOYEE_STATUS,
      [ShoppexEmployee.name]: ORDER_CANCELED_BY_SHOPPEX_STATUS,
    };
    const { type } = user;

    try {
      const updatedOrder = await this.updateOrderStatus(orderId, cancelByMap[type]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.findOne(orderId);

      await this.orderSocketGateway.handleUpdateOrderToClient({
        _id: order._id.toString(),
        branch: order.branch,
        orderCreatedBy: order.orderCreatedBy,
        items: order.items,
        invoice: order.invoice,
        status: order.status,
        orderRefId: order.orderRefId,
        orderType: order.orderType,
      });

      await this.notificationQueue.add(CANCEL_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderCancelledEvent, orderActivityEvent } = this.factoryService.canceledOrderEvent(
        user,
        updatedOrder,
        type,
      );

      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);
      this.eventEmitter.emit('orderCancelled', orderCancelledEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async rejectOrder(user: any, orderId: string, dashboardOrderRejectDto: DashboardOrderRejectDto) {
    const rejectByMap = {
      [MerchantEmployee.name]: ORDER_REJECTED_BY_EMPLOYEE_STATUS,
      [Owner.name]: ORDER_REJECTED_BY_EMPLOYEE_STATUS,
      [ShoppexEmployee.name]: ORDER_REJECTED_BY_SHOPPEX_STATUS,
    };
    const { type } = user;

    try {
      const updatedOrder = await this.updateOrderStatus(orderId, rejectByMap[type], [ORDER_PENDING_STATUS], {
        rejectedNotes: dashboardOrderRejectDto.rejectedNotes,
      });

      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.findOne(orderId);

      await this.orderSocketGateway.handleUpdateOrderToClient({
        _id: order._id.toString(),
        branch: order.branch,
        orderCreatedBy: order.orderCreatedBy,
        items: order.items,
        invoice: order.invoice,
        status: order.status,
        orderRefId: order.orderRefId,
        orderType: order.orderType,
      });

      await this.notificationQueue.add(REJECTED_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderRejectedEvent, orderActivityEvent } = this.factoryService.rejectedOrderEvent(
        user,
        updatedOrder,
        type,
        dashboardOrderRejectDto.rejectedNotes,
        dashboardOrderRejectDto.outOfStockProductsIds,
      );

      if (dashboardOrderRejectDto?.outOfStockProductsIds?.length > 0) {
        await Promise.all(
          dashboardOrderRejectDto?.outOfStockProductsIds?.map((element) =>
            this.productRepository.updateOne(
              {
                _id: new mongoose.Types.ObjectId(element),
              },
              {
                status: STATUS.INACTIVE,
                remainingQuantity: 0,
              },
              { new: true, lean: true },
            ),
          ),
        );
      }

      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);
      // this.eventEmitter.emit('orderRejected', orderRejectedEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async ready(user: any, orderId: string) {
    const updatedOrder = await this.updateOrderStatus(orderId, ORDER_READY_STATUS, [ORDER_ACCEPTED_STATUS]);
    if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

    const orderReadyEvent = new OrderReadyEvent();

    orderReadyEvent.status = updatedOrder.status;
    orderReadyEvent.orderId = updatedOrder['_id'];

    const order = await this.findOne(orderId);

    await this.orderSocketGateway.handleUpdateOrderToClient({
      _id: order._id.toString(),
      branch: order.branch,
      orderCreatedBy: order.orderCreatedBy,
      items: order.items,
      invoice: order.invoice,
      status: order.status,
      orderRefId: order.orderRefId,
      orderType: order.orderType,
    });

    await this.orderQueue.add(READY_ORDER_PROCESSOR, updatedOrder, {
      delay: 180 * 1000 * 60,
      jobId: `${updatedOrder['_id']}-${updatedOrder.branchId['name']}`,
    });

    await this.notificationQueue.add(READY_ORDER_NOTIFICATION_PROCESS, order, {
      attempts: 3,
    });

    const orderReadyActivity = new Activity();
    orderReadyActivity.order = updatedOrder['_id'].toString();
    orderReadyActivity.merchant = updatedOrder.branchId['merchantId'];
    orderReadyActivity.actor = user['_id'];
    orderReadyActivity.scope = 'MerchantEmployee';
    orderReadyActivity.status = updatedOrder.status;
    this.activitiesClient.emit(UPDATE_ORDER, orderReadyActivity);
    return this.eventEmitter.emit('orderReady', orderReadyEvent) && updatedOrder;
  }

  async delivered(user: any, orderId: string) {
    const updatedOrder = await this.updateOrderStatus(orderId, ORDER_DELIVERED_STATUS, [ORDER_READY_STATUS]);
    if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

    const order = await this.findOne(orderId);

    const bufferPDF = await this.generateArabicInvoice({ order });

    this.mailService.sendInvoiceToClient(
      {
        name: updatedOrder.orderCreatedBy['name'],
        email: updatedOrder.orderCreatedBy['email'],
      },
      [{ filename: 'invoice.pdf', content: bufferPDF, contentType: "'application/pdf'" }],
    );

    await this.notificationQueue.add(DELIVERED_ORDER_NOTIFICATION_PROCESS, order, {
      attempts: 3,
    });

    await this.orderSocketGateway.handleUpdateOrderToClient({
      _id: order._id.toString(),
      branch: order.branch,
      orderCreatedBy: order.orderCreatedBy,
      items: order.items,
      invoice: order.invoice,
      status: order.status,
      orderRefId: order.orderRefId,
      orderType: order.orderType,
    });

    const orderDeliveredEvent = new OrderDeliveredEvent();

    orderDeliveredEvent.status = updatedOrder.status;
    orderDeliveredEvent.orderId = updatedOrder['_id'];
    orderDeliveredEvent.merchantId = updatedOrder.branchId['merchantId'];
    orderDeliveredEvent.orderType = order.orderType;
    orderDeliveredEvent.orderInvoice = order.invoice;

    const orderDeliveredActivity = new Activity();
    orderDeliveredActivity.order = updatedOrder['_id'];
    orderDeliveredActivity.merchant = updatedOrder.branchId['merchantId'];
    orderDeliveredActivity.actor = user['_id'];
    orderDeliveredActivity.scope = 'MerchantEmployee';
    orderDeliveredActivity.status = updatedOrder.status;
    this.activitiesClient.emit(UPDATE_ORDER, orderDeliveredActivity);

    return this.eventEmitter.emit('orderDelivered', orderDeliveredEvent) && updatedOrder;
  }

  private async updateOrderStatus(id: string, newStatus: string, prevStatus?: Array<string>, obj?: object) {
    const matchQuery: { _id: mongoose.Types.ObjectId; status?: object } = {
      _id: new mongoose.Types.ObjectId(id),
    };
    if (prevStatus && prevStatus?.length > 0) matchQuery.status = { $in: prevStatus };

    const updatedOrder = await this.orderRepository.updateOne(
      matchQuery,
      { status: newStatus, ...obj },
      {
        new: true,
        lean: true,
        populate: [
          {
            path: 'branchId',
          },
          {
            path: 'orderCreatedBy',
          },
          {
            path: 'driverId',
          },
        ],
      },
    );
    if (updatedOrder?.orderType == ORDER_TYPE.ORDER_STORE_DELIVERY) {
      updatedOrder['driver'] = updatedOrder?.driverId;
      updatedOrder['driverId'] = updatedOrder?.['driver']?._id;
    }
    return updatedOrder;
  }

  async clientHistory(merchantId: string, orderCreatedBy: string) {
    const clientHistory = await this.orderRepository._model.aggregate([
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branchId',
        },
      },
      {
        $unwind: {
          path: '$branchId',
        },
      },
      {
        $match: {
          'branchId.merchantId': new Types.ObjectId(merchantId),
          orderCreatedBy: new Types.ObjectId(orderCreatedBy),
        },
      },
      {
        $facet: {
          Total: [{ $count: 'count' }],
          Canceled: [
            {
              $match: {
                status: {
                  $in: [
                    ORDER_CANCELED_BY_CLIENT_STATUS,
                    ORDER_CANCELED_BY_EMPLOYEE_STATUS,
                    ORDER_CANCELED_BY_SHOPPEX_STATUS,
                    ORDER_EXPIRED_STATUS,
                    ORDER_CANCELED_BY_MERCHANT_STATUS,
                    ORDER_CANCELED_BY_OPERATION_STATUS,
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return {
      total: clientHistory[0]?.Total[0]?.count ? clientHistory[0]?.Total[0].count : 0,
      canceled: clientHistory[0]?.Canceled[0]?.count ? clientHistory[0].Canceled[0].count : 0,
    };
  }

  async clientOrderingHistory(merchantId: string, query: GetAllDto) {
    const { limit, page } = query;

    const merchantCustomers = await this.orderRepository._model.aggregate([
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branchId',
        },
      },
      {
        $unwind: {
          path: '$branchId',
        },
      },
      {
        $match: {
          'branchId.merchantId': new Types.ObjectId(merchantId),
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'client',
          let: { clientId: '$clientId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$clientId'] }, { $eq: ['$type', 'Client'] }, { $eq: ['$isDeleted', false] }],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          client: 1,
          branchId: 1,
        },
      },
      {
        $group: {
          _id: { client: '$client' },
          client: { $first: '$client' },
          branches: { $addToSet: '$branchId' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $facet: {
          newCustomers: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$orderCount', 1],
                    },
                    { $ne: ['$client.merchantId', '$branches.merchantId'] },
                    { $ne: ['$client', []] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            { $project: { _id: 0 } },
          ],
          returnCustomers: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$orderCount', 3],
                    },
                    { $ne: ['$client.merchantId', '$branches.merchantId'] },
                    { $ne: ['$client', []] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            { $project: { _id: 0 } },
          ],
          loyaltyCustomers: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $gt: ['$orderCount', 3],
                    },
                    { $ne: ['$client.merchantId', '$branches.merchantId'] },
                    { $ne: ['$client', []] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            { $project: { _id: 0 } },
          ],
          customers: [
            {
              $match: {
                $expr: {
                  $and: [{ $ne: ['$client.merchantId', '$branches.merchantId'] }, { $ne: ['$client', []] }],
                },
              },
            },
            {
              $project: {
                _id: 0,
                client: 1,
                branches: 1,
                orderCount: 1,
              },
            },
            {
              $skip: page <= 0 ? 0 : limit * page,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);

    const totalCount = await this.orderRepository._model.aggregate([
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branchId',
        },
      },
      {
        $unwind: {
          path: '$branchId',
        },
      },
      {
        $match: {
          'branchId.merchantId': new Types.ObjectId(merchantId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'orderCreatedBy',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $group: {
          _id: '$client',
        },
      },
    ]);

    const count = totalCount.length || 0;

    const pagesCount = Math.ceil(count / limit) || 1;

    return {
      newCustomers: merchantCustomers[0]?.newCustomers?.length > 0 ? merchantCustomers[0]?.newCustomers[0].count : 0,
      returnCustomers:
        merchantCustomers[0]?.returnCustomers?.length > 0 ? merchantCustomers[0]?.returnCustomers[0].count : 0,
      loyaltyCustomers:
        merchantCustomers[0]?.loyaltyCustomers?.length > 0 ? merchantCustomers[0]?.loyaltyCustomers[0].count : 0,
      customers: merchantCustomers[0]?.customers,
      page: page,
      pages: pagesCount,
      length: count,
    };
  }

  async dashboardFindAllClientsClustering(query: FindAllClientsClusteringDto) {
    return this.orderRepository.dashboardFindAllClientsClustering(query);
  }
}
