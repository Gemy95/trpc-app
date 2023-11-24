import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

import { Branch } from '..';
import { COUPON_STATUS } from '../../common/constants/coupon.constants';
import { AMOUNT_TYPE, ORDER_TYPE } from '../../common/constants/order.constants';
import { Merchant } from '../merchant/merchant.schema';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  readonly _id: string;

  @Prop({
    type: String,
    required: true /*unique: true, index: { unique: true }*/,
  })
  code: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  image?: string;

  @Prop({ type: Date, required: true })
  valid_from: Date;

  @Prop({ type: Date, required: true })
  expired_at: Date;

  @Prop({
    type: String,
    enum: COUPON_STATUS,
    default: COUPON_STATUS.Active,
    required: false,
  })
  status?: string;

  @Prop({ type: Number, required: true })
  total_max_use: number;

  @Prop({ type: Number, required: true })
  max_use_per_client: number;

  @Prop({ type: Number, required: false, default: 0 })
  discount_amount?: number;

  @Prop({
    type: String,
    enum: AMOUNT_TYPE,
    default: AMOUNT_TYPE.FIXED,
    required: false,
  })
  discount_type?: string;

  @Prop({ type: Boolean, required: false, default: false })
  free_delivery?: boolean;

  // → rules

  @Prop({ type: Boolean, required: false, default: false })
  is_new_client?: boolean;

  @Prop({ type: Number, required: false, default: 0 })
  client_orders_count_more_than?: number;

  @Prop({ type: String, enum: ORDER_TYPE, default: ORDER_TYPE.ORDER_DINING })
  orderType?: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Merchant' })
  merchantId: string | mongoose.Types.ObjectId | Merchant;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Branch' })
  branchId: string | mongoose.Types.ObjectId | Branch;

  // @Prop({ type: Array<string | Types.ObjectId>, required: true })
  // branchesIds: string[] | mongoose.Types.ObjectId[];

  @Prop({ type: Array<string | Types.ObjectId>, required: false })
  productsIds?: string[] | mongoose.Types.ObjectId[];

  @Prop({ type: Number, required: false, default: 0 })
  max_discount_amount?: number;

  @Prop({ type: Number, required: false, default: 0 })
  lowest_cart_price?: number;

  @Prop({ type: Boolean, required: false, default: false })
  is_reusable?: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
