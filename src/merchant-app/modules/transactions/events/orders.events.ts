import { ORDER_DELIVERED_STATUS, ORDER_READY_STATUS, ORDER_STATUS } from '../../common/constants/order.constants';
import { TRANSACTION_TYPE } from '../../common/constants/transaction.constants';

export class OrderAcceptedEvent {
  orderId: string;
  amount: number;
  tax: number;
  commission: number;
  from: any;
  to: any;
  operationType: TRANSACTION_TYPE;
  status: string;
}

export class OrderCancelledEvent {
  status: string;
}

export class OrderRejectedEvent {
  orderId: string;
  status: string;
  rejectedNotes: string[];
  outOfStockProductsIds: string[];
}

export class OrderReadyEvent {
  status: string = ORDER_READY_STATUS;
  orderId: string;
}

export class OrderDeliveredEvent {
  status: string = ORDER_DELIVERED_STATUS;
  orderId: string;
  merchantId?: string;
  orderType?: string;
  orderInvoice?: any;
}

export class OrderOnWayToClientEvent {
  status: string = ORDER_STATUS.ORDER_ON_WAY_TO_CLIENT;
  orderId: string;
}

export class OrderArrivedToClientEvent {
  status: string = ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT;
  orderId: string;
}

export class OrderDeliveredClientEvent {
  status: string = ORDER_STATUS.ORDER_ARRIVED_TO_CLIENT;
  orderId: string;
}

export class OrderClientNotRespondEvent {
  status: string = ORDER_STATUS.ORDER_CLIENT_NOT_RESPOND;
  orderId: string;
}

export class OrderClientNotDeliveredEvent {
  status: string = ORDER_STATUS.ORDER_CLIENT_NOT_DELIVERED;
  orderId: string;
}
