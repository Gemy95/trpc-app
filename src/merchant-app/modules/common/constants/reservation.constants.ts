export const RESERVATION_PENDING_STATUS = 'pending';
export const RESERVATION_REJECTED_STATUS = 'rejected';
export const RESERVATION_ACCEPTED_STATUS = 'accepted';
export const RESERVATION_ATTENDED_STATUS = 'attended';
export const RESERVATION_WAITING_STATUS = 'waiting';
export const RESERVATION_CANCELED_BY_CLIENT_STATUS = 'canceled_by_client';
export const RESERVATION_CANCELED_BY_EMPLOYEE_STATUS = 'canceled_by_employee';
export const RESERVATION_CANCELED_BY_SHOPPEX_STATUS = 'canceled_by_shoppex';
export const RESERVATION_CANCELED_BY_SYSTEM_STATUS = 'canceled_by_system';

export enum RESERVATION_STATUS {
  RESERVATION_PENDING_STATUS = 'pending',
  RESERVATION_REJECTED_STATUS = 'rejected',
  RESERVATION_ACCEPTED_STATUS = 'accepted',
  RESERVATION_ATTENDED_STATUS = 'attended',
  RESERVATION_WAITING_STATUS = 'waiting',
  RESERVATION_CANCELED_BY_CLIENT_STATUS = 'canceled_by_client',
  RESERVATION_CANCELED_BY_EMPLOYEE_STATUS = 'canceled_by_employee',
  RESERVATION_CANCELED_BY_SHOPPEX_STATUS = 'canceled_by_shoppex',
  RESERVATION_CANCELED_BY_SYSTEM_STATUS = 'canceled_by_system',
}

export enum APPROVE_OR_REJECT_RESERVATION_STATUS {
  RESERVATION_REJECTED_STATUS = 'rejected',
  RESERVATION_ACCEPTED_STATUS = 'accepted',
  RESERVATION_WAITING_STATUS = 'waiting',
}

export enum RESERVATION_TYPE {
  ORDER_OFFLINE_BOOK = 'offline_book',
  ORDER_BOOK = 'book',
}

export enum RESERVATION_PLATFORM {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
  DESKTOP = 'desktop',
  STORE_FRONT_WEB = 'store_front_web',
  STORE_FRONT_MOBILE = 'store_front_mobile',
}

// export enum RESERVATION_GUEST_TYPE {
//   ADULT = 'adult',
//   CHILDREN = 'children',
// }
