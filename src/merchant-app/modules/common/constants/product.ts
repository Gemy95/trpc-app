import mongoose from 'mongoose';
import { DiscountTypes } from './discount.constants';

export const PRODUCT_PENDING_STATUS = 'pending';
export const PRODUCT_APPROVED_STATUS = 'approved';
export const PRODUCT_REJECTED_STATUS = 'rejected';

// Approval BUILD_STATUS
export const PENDING_STATUS = 'pending';
export const APPROVED_STATUS = 'approved';
export const REJECTED_STATUS = 'rejected';

// release statuses
export const STAGING_STATUS = 'staging';
export const PRODUCTION_STATUS = 'production';
export const TESTING_STATUS = 'testing';

export enum PRODUCT_STATUS {
  PRODUCT_PENDING_STATUS = 'pending',
  PRODUCT_APPROVED_STATUS = 'approved',
  PRODUCT_REJECTED_STATUS = 'rejected',
}

export enum BUILD_STATUS {
  PENDING_STATUS = 'pending',
  APPROVED_STATUS = 'approved',
  REJECTED_STATUS = 'rejected',
}

export enum RELEASE_STATUS {
  STAGING_STATUS = 'staging',
  PRODUCTION_STATUS = 'production',
  TESTING_STATUS = 'testing',
}

/**
 * Product Meals Time
 */
export const PRODUCT_MEALS_TIME_BREAKFAST = 'breakfast';
export const PRODUCT_MEALS_TIME_LAUNCH = 'launch';
export const PRODUCT_MEALS_TIME_DINNER = 'dinner';

export enum PRODUCT_MEALS_TIME {
  PRODUCT_BREAKFAST = 'breakfast',
  PRODUCT_LAUNCH = 'launch',
  PRODUCT_DINNER = 'dinner',
}

interface IDiscount {
  _id?: mongoose.Types.ObjectId;

  amount: number;

  type: DiscountTypes;

  startDate: Date;

  endDate: Date;

  isActive: boolean;
}
interface ITranslation {
  _lang: string;

  name: string;
}
interface IOptions {
  _id: mongoose.Types.ObjectId;

  name: string;

  extraPrice: number;

  translation: ITranslation[];
}
interface IGroup {
  _id: mongoose.Types.ObjectId;
  options: IOptions[];
}

export interface ITime {
  from: string;

  to: string;
}

export interface IMealsTime {
  name?: string;

  times?: ITime;
}

export interface IPrepareOrder {
  _id: mongoose.Types.ObjectId;
  name: string;
  groups: IGroup[];
  preparationTime: number;
  price: number;
  discount: IDiscount;
  mealsTime?: IMealsTime[];
}
