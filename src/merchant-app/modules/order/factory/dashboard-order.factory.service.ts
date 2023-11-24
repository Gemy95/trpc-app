import { Activity } from '../../common/constants/activities.event.constants';
import { Order } from '../../models';
import {
  OrderAcceptedEvent,
  OrderArrivedToClientEvent,
  OrderCancelledEvent,
  OrderClientNotDeliveredEvent,
  OrderClientNotRespondEvent,
  OrderDeliveredClientEvent,
  OrderOnWayToClientEvent,
  OrderRejectedEvent,
} from '../../transactions/events/orders.events';

export class DashboardOrderFactoryService {
  createNewOrderEvent(
    user: any,
    order: any,
    total: number,
  ): { orderAcceptedEvent: OrderAcceptedEvent; orderActivityEvent: Activity } {
    const orderAcceptedEvent = new OrderAcceptedEvent();
    const orderActivityEvent = new Activity();

    orderAcceptedEvent.orderId = order._id;
    orderAcceptedEvent.amount = total;
    orderAcceptedEvent.tax = 15;
    orderAcceptedEvent.from = order?.orderCreatedBy._id;
    orderAcceptedEvent.to = order.merchant._id;
    orderAcceptedEvent.status = order.status;

    orderActivityEvent.order = order._id;
    orderActivityEvent.merchant = order.merchant._id;
    orderActivityEvent.actor = user?._id;
    orderActivityEvent.scope = 'MerchantEmployee';

    return { orderAcceptedEvent, orderActivityEvent };
  }

  acceptOrderEvent(user: any, order: Order): { orderAcceptedEvent: OrderAcceptedEvent; orderActivityEvent: Activity } {
    const orderAcceptedEvent = new OrderAcceptedEvent();
    orderAcceptedEvent.amount = order.invoice.total;
    orderAcceptedEvent.tax = order.invoice.charges[1].amount;
    orderAcceptedEvent.orderId = order['_id'];
    orderAcceptedEvent.from = order.orderCreatedBy['_id'];
    orderAcceptedEvent.to = order.branchId['merchantId'];
    orderAcceptedEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = 'MerchantEmployee';
    orderActivityEvent.status = order.status;

    return {
      orderAcceptedEvent,
      orderActivityEvent,
    };
  }

  canceledOrderEvent(
    user: any,
    order: Order,
    type: string,
  ): { orderCancelledEvent: OrderCancelledEvent; orderActivityEvent: Activity } {
    const orderCancelledEvent = new OrderCancelledEvent();
    orderCancelledEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderCancelledEvent,
      orderActivityEvent,
    };
  }

  rejectedOrderEvent(
    user: any,
    order: Order,
    type: string,
    rejectedNotes: string[],
    outOfStockProductsIds: string[],
  ): { orderRejectedEvent: OrderRejectedEvent; orderActivityEvent: Activity } {
    const orderRejectedEvent = new OrderRejectedEvent();
    orderRejectedEvent.status = order.status;
    orderRejectedEvent.orderId = order._id;
    orderRejectedEvent.rejectedNotes = rejectedNotes;
    orderRejectedEvent.outOfStockProductsIds = outOfStockProductsIds;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderRejectedEvent,
      orderActivityEvent,
    };
  }

  onWayToClientOrderEvent(
    user: any,
    order: Order,
  ): { orderOnWayToClientEvent: OrderOnWayToClientEvent; orderActivityEvent: Activity } {
    const { type } = user;
    const orderOnWayToClientEvent = new OrderOnWayToClientEvent();
    orderOnWayToClientEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderOnWayToClientEvent,
      orderActivityEvent,
    };
  }

  arrivedToClientOrderEvent(
    user: any,
    order: Order,
  ): { orderArrivedToClientEvent: OrderArrivedToClientEvent; orderActivityEvent: Activity } {
    const { type } = user;
    const orderArrivedToClientEvent = new OrderArrivedToClientEvent();
    orderArrivedToClientEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderArrivedToClientEvent,
      orderActivityEvent,
    };
  }

  deliveredToClientOrderEvent(
    user: any,
    order: Order,
  ): { orderDeliveredClientEvent: OrderDeliveredClientEvent; orderActivityEvent: Activity } {
    const { type } = user;
    const orderDeliveredClientEvent = new OrderDeliveredClientEvent();
    orderDeliveredClientEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderDeliveredClientEvent,
      orderActivityEvent,
    };
  }

  clientNotRespondOrderEvent(
    user: any,
    order: Order,
  ): { orderClientNotRespondEvent: OrderClientNotRespondEvent; orderActivityEvent: Activity } {
    const { type } = user;
    const orderClientNotRespondEvent = new OrderClientNotRespondEvent();
    orderClientNotRespondEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderClientNotRespondEvent,
      orderActivityEvent,
    };
  }

  clientNotDeliveredOrderEvent(
    user: any,
    order: Order,
  ): { orderClientNotDeliveredEvent: OrderClientNotDeliveredEvent; orderActivityEvent: Activity } {
    const { type } = user;
    const orderClientNotDeliveredEvent = new OrderClientNotDeliveredEvent();
    orderClientNotDeliveredEvent.status = order.status;

    const orderActivityEvent = new Activity();
    orderActivityEvent.order = order['_id'];
    orderActivityEvent.merchant = order.branchId['merchantId'];
    orderActivityEvent.actor = user['_id'];
    orderActivityEvent.scope = type;
    orderActivityEvent.status = order.status;

    return {
      orderClientNotDeliveredEvent,
      orderActivityEvent,
    };
  }
}
