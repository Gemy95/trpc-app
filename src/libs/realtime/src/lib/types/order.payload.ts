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

export enum PAYMENT_TYPES {
  PAYMENT_CASH_TYPE = 'cash',
  PAYMENT_VISA_TYPE = 'visa',
  PAYMENT_MADA_TYPE = 'mada',
  PAYMENT_MASTERCARD_TYPE = 'mastercard',
  PAYMENT_APPLEPAY_TYPE = 'apple pay',
}

class Options {
  _id: any;
  name?: string;
  extraPrice?: number;
}

class Groups {
  productGroupId: any;
  options: Options[];
}

class Item {
  count: number;
  productId: any;
  groups?: Groups[];
}

export class OrderPayload {
  branchId?: string;
  clientNotes?: string[];
  paymentType?: PAYMENT_TYPES;
  orderType?: ORDER_TYPE;
  items?: Item[];
}
