import { Branch, Client, Merchant, Order, Product } from '../../models';

export enum USER_TYPES {
  MERHCNAT_EMPLOYEE = 'MerchantEmployee',
  SHOPPEX_EMPLOYEE = 'ShoppexEmployee',
  SYSTEM = 'System',
  CLIENT = 'Client',
  ADMIN = 'Admin',
  OWNER = 'Owner',
}

export enum ACTION {
  SHOPPEX_EMPLOYEE = 'ShoppexEmployee',
  ORDER = 'Order',
  RATING = 'Rating',
  REVIEW = 'Review',
  CLIENT = 'Client',
  PRODUCT = 'Product',
}

export enum PLATFORM {
  DESKTOP = 'desktop',
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
  ALL = 'all',
}

export enum ONE_SIGNAL_FILTERS {
  FIRST_SESSION = 'first_session',
  SESSION_COUNT = 'session_count',
  LAST_SESSION = 'last_session',
  SESSION_TIME = 'session_time',
  AMOUNT_SPENT = 'amount_spent',
  APP_VERSION = 'app_version',
  LANGUAGE = 'language',
  LOCATION = 'location',
  COUNTRY = 'country',
  EMAIL = 'email',
  TAG = 'tag',
}
