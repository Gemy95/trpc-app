import { Branch } from '../../../../libs/database/src/lib/models/branch/branch.schema';
import { Client } from '../../../../libs/database/src/lib/models/client/client.schema';
import { Merchant } from '../../../../libs/database/src/lib/models/merchant/merchant.schema';
import { Order } from '../../../../libs/database/src/lib/models/order/order.schema';
import { Product } from '../../../../libs/database/src/lib/models/product/product.schema';
import { Rating } from '../../../../libs/database/src/lib/models/rating/rating.schema';
import { Review } from '../../../../libs/database/src/lib/models/review/update-request-review.schema';

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

export const BRANCH_ACTION = Branch.name;
export const ORDER_ACTION = Order.name;
export const RATION_ACTION = Rating.name;
export const MERCHANT_ACTION = Merchant.name;
export const REQUEST_ACTION = Review.name;
export const CLIENT_ACTION = Client.name;
export const PRODUCT_ACTION = Product.name;
