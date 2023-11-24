import mongoose from 'mongoose';
import { Invoice } from '../../models/order/invoice.schema';

/**
 * Order stauts
 */
export const ORDER_PENDING_STATUS = 'pending';
export const ORDER_ACCEPTED_STATUS = 'accepted';
export const ORDER_IN_PROGRESS_STATUS = 'inprogress';
export const ORDER_READY_STATUS = 'ready';
export const ORDER_ACTIVE_STATUS = 'active';
export const ORDER_DELIVERED_STATUS = 'delivered';
export const ORDER_EXPIRED_STATUS = 'expired';
export const ORDER_CANCELED_BY_MERCHANT_STATUS = 'canceled_by_merchant';
export const ORDER_CANCELED_BY_OPERATION_STATUS = 'canceled_by_operation';
export const ORDER_CANCELED_BY_CLIENT_STATUS = 'canceled_by_client';
export const ORDER_CANCELED_BY_EMPLOYEE_STATUS = 'canceled_by_employee';
export const ORDER_CANCELED_BY_SHOPPEX_STATUS = 'canceled_by_shoppex';
export const ORDER_REJECTED_BY_MERCHANT_STATUS = 'rejected_by_merchant';
export const ORDER_REJECTED_BY_OPERATION_STATUS = 'rejected_by_operation';
export const ORDER_REJECTED_BY_EMPLOYEE_STATUS = 'rejected_by_employee';
export const ORDER_REJECTED_BY_SHOPPEX_STATUS = 'rejected_by_shoppex';

export const REDIS_ORDER_NAME_SPACE = 'redis_order_name_space';

/**
 * Order type
 */
export enum ORDER_TYPE {
  ORDER_PICKUP = 'pickup', // client will pick up the
  ORDER_CAR_PICKUP = 'car_pickup', // client will pick up the order in a car
  ORDER_OFFLINE = 'offline', // this order usually comes from a employee inside the restaurant
  ORDER_DINING = 'dining', // client will eat in the restaurant
  ORDER_BOOK = 'book', // client will book a table in the restaurant
  ORDER_OFFLINE_BOOK = 'offline_book', // this booking usually comes from an employee inside the restaurant or a call center or a client inside the restaurant
  ORDER_DELIVERY = 'delivery', // client will receive the order at the indeed address
  ORDER_STORE_DELIVERY = 'store_delivery',
}

export enum ORDER_STATUS {
  ORDER_PENDING_STATUS = 'pending',
  ORDER_ACCEPTED_STATUS = 'accepted',
  ORDER_IN_PROGRESS_STATUS = 'inprogress',
  ORDER_READY_STATUS = 'ready',
  ORDER_ACTIVE_STATUS = 'active',
  ORDER_DELIVERED_STATUS = 'delivered',
  ORDER_EXPIRED_STATUS = 'expired',
  ORDER_CANCELED_BY_MERCHANT_STATUS = 'canceled_by_merchant',
  ORDER_CANCELED_BY_OPERATION_STATUS = 'canceled_by_operation',
  ORDER_CANCELED_BY_CLIENT_STATUS = 'canceled_by_client',
  ORDER_CANCELED_BY_EMPLOYEE_STATUS = 'canceled_by_employee',
  ORDER_CANCELED_BY_SHOPPEX_STATUS = 'canceled_by_shoppex',
  ORDER_REJECTED_BY_MERCHANT_STATUS = 'rejected_by_merchant',
  ORDER_REJECTED_BY_OPERATION_STATUS = 'rejected_by_operation',
  ORDER_REJECTED_BY_EMPLOYEE_STATUS = 'rejected_by_employee',
  ORDER_REJECTED_BY_SHOPPEX_STATUS = 'rejected_by_shoppex',
  ORDER_ON_WAY_TO_CLIENT = 'on_way_to_client',
  ORDER_ARRIVED_TO_CLIENT = 'arrived_to_client',
  ORDER_CLIENT_NOT_RESPOND = 'client_not_respond',
  ORDER_CLIENT_NOT_DELIVERED = 'client_not_delivered',
}

export enum AMOUNT_TYPE {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

interface Translation {
  _lang: string;
  name: string;
}

interface Option {
  name: string;
  extraPrice: number;
  translation: Translation[];
  _id: mongoose.Types.ObjectId;
}

interface Group {
  productGroupId: mongoose.Types.ObjectId;
  options: Option[];
}

interface Item {
  count: number;
  productId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    price: number;
    preparationTime: number;
    status: string;
    discount: mongoose.Types.ObjectId;
    translation: Translation[];
  };
  groups: Group[];
}
export interface IFindOneOrder {
  _id: mongoose.Types.ObjectId;
  invoice: Invoice;
  status: string;
  clientNotes: string[];
  merchantNotes: string[];
  estimatedPreparationTime: Date;
  localOrder: boolean;
  orderType: string;
  orderRefId: string;
  orderSeqId: number;
  rateStatus: string;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
  orderCreatedBy: {
    _id: mongoose.Types.ObjectId;
    name: string;
    type: string;
  };
  merchant: {
    _id: mongoose.Types.ObjectId;
    name: string;
    logo: string;
    translation: Translation[];
  };
  branch: {
    _id: mongoose.Types.ObjectId;
    name: string;
    mobile: string;
    translation: Translation[];
    location: Location;
  };
  client: {
    _id: mongoose.Types.ObjectId;
    name: string;
    type: string;
  };
}
