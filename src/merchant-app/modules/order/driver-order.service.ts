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
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { BranchService } from '../branch/branch.service';
import { UPDATE_ORDER } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { ORDER_ACCEPTED_STATUS, ORDER_STATUS, ORDER_TYPE } from '../common/constants/order.constants';
import {
  ARRIVED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
  CLIENT_NOT_DELIVERED_ORDER_NOTIFICATION_PROCESS,
  CLIENT_NOT_RESPOND_ORDER_NOTIFICATION_PROCESS,
  DELIVERED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  ON_WAY_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
  ORDER_QUEUE,
} from '../common/constants/queue.constants';
import { MailService } from '../mail/mail.service';
import { CounterRepository, MerchantEmployeeRepository, OrderRepository, ProductRepository } from '../models';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { OrderSocketGateway } from '../socket/order.socket.gateway';
import { DashboardOrderQueryDto } from './dto/dashboard-orders-query.dto';
import { DashboardOrderFactoryService } from './factory/dashboard-order.factory.service';
import { OrderSharedService } from './shared/order.shared.service';

@Injectable()
export class DriverOrderService extends OrderSharedService {
  constructor(
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    @InjectQueue(ORDER_QUEUE) private readonly orderQueue: Queue,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    private readonly orderRepository: OrderRepository,
    private readonly prodcutRepository: ProductRepository,
    private readonly counterRepository: CounterRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly orderSocketGateway: OrderSocketGateway,
    private readonly mailService: MailService,
    private readonly factoryService: DashboardOrderFactoryService,
    private readonly merchantGateWay: MerchantGateWay,
    private readonly branchService: BranchService,
    private readonly merchantEmployeeRepository: MerchantEmployeeRepository,
  ) {
    super(orderRepository, prodcutRepository);
  }

  private logger = new Logger(DriverOrderService.name);

  driverFindAllOrder(query: DashboardOrderQueryDto, branchId: string, user: any) {
    return this.orderRepository.listOrdersDriver(query, branchId, user);
  }

  async driverOrderDetails(user: any, orderId: string) {
    const order = await this.driverFindOneOrder(orderId, user);

    const orderViewActivity = new Activity();
    orderViewActivity.scope = 'MerchantEmployee';
    orderViewActivity.actor = user._id;
    orderViewActivity.order = order._id.toString();
    orderViewActivity.merchant = order.merchant._id.toString();
    orderViewActivity.status = order.status;
    this.activitiesClient.emit('updateOrder', orderViewActivity);

    return order;
  }

  async onWayToClientOrder(user: any, orderId: string) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());

      const updatedOrder = await this.updateOrderStatus(orderId, ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT, [
        ORDER_ACCEPTED_STATUS,
      ]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.driverFindOneOrder(orderId, user);

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

      await this.notificationQueue.add(ON_WAY_TO_CLIENT_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderOnWayToClientEvent, orderActivityEvent } = this.factoryService.onWayToClientOrderEvent(
        user,
        updatedOrder,
      );

      this.eventEmitter.emit('orderOnWayToClient', orderOnWayToClientEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async arrivedToClientOrder(user: any, orderId: string) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());

      const updatedOrder = await this.updateOrderStatus(orderId, ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT, [
        ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT,
      ]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.driverFindOneOrder(orderId, user);

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

      await this.notificationQueue.add(ARRIVED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderArrivedToClientEvent, orderActivityEvent } = this.factoryService.arrivedToClientOrderEvent(
        user,
        updatedOrder,
      );

      this.eventEmitter.emit('orderArrivedToClient', orderArrivedToClientEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deliveredToClientOrder(user: any, orderId: string) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());

      const updatedOrder = await this.updateOrderStatus(orderId, ORDER_STATUS.ORDER_DELIVERED_STATUS, [
        ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT,
        ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT,
      ]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.driverFindOneOrder(orderId, user);

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

      await this.notificationQueue.add(DELIVERED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderDeliveredClientEvent, orderActivityEvent } = this.factoryService.deliveredToClientOrderEvent(
        user,
        updatedOrder,
      );

      this.eventEmitter.emit('orderDeliveredToClient', orderDeliveredClientEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async clientNotRespondOrder(user: any, orderId: string) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());

      const updatedOrder = await this.updateOrderStatus(orderId, ORDER_STATUS.ORDER_CLIENT_NOT_RESPOND, [
        ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT,
        ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT,
      ]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      const order = await this.driverFindOneOrder(orderId, user);

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

      await this.notificationQueue.add(CLIENT_NOT_RESPOND_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderClientNotRespondEvent, orderActivityEvent } = this.factoryService.clientNotRespondOrderEvent(
        user,
        updatedOrder,
      );

      this.eventEmitter.emit('orderClientNotRespond', orderClientNotRespondEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async clientNotDeliveredOrder(user: any, orderId: string) {
    try {
      const currentOrder = await this.orderRepository.getOne({ _id: new mongoose.Types.ObjectId(orderId) });
      const currentBranch = await this.branchService.getOneBranch(currentOrder.branchId.toString());

      const updatedOrder = await this.updateOrderStatus(orderId, ORDER_STATUS.ORDER_CLIENT_NOT_DELIVERED, [
        ORDER_STATUS.ORDER_CLIENT_NOT_RESPOND,
        ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT,
      ]);
      if (!updatedOrder) throw new NotFoundException(ERROR_CODES.err_order_not_found);

      // await this.orderQueue.add(CLIENT_NOT_DELIVERED_ORDER_PROCESSOR, updatedOrder, {
      //   delay: (180 * 1000 * 60),
      //   jobId: `${updatedOrder['_id']}-${updatedOrder.branchId['name']}`,
      // });

      const order = await this.driverFindOneOrder(orderId, user);

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

      await this.notificationQueue.add(CLIENT_NOT_DELIVERED_ORDER_NOTIFICATION_PROCESS, order, {
        attempts: 3,
      });

      const { orderClientNotDeliveredEvent, orderActivityEvent } = this.factoryService.clientNotDeliveredOrderEvent(
        user,
        updatedOrder,
      );

      this.eventEmitter.emit('orderClientNotDelivered', orderClientNotDeliveredEvent);
      this.activitiesClient.emit(UPDATE_ORDER, orderActivityEvent);

      return updatedOrder;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
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
}
