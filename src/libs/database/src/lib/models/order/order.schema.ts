import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Branch, Client, Coupon, DeliveryProvider, Table, User } from '..';
import { Address } from '../../../lib/models/address/address.schema';
import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { ORDER_PENDING_STATUS, ORDER_STATUS, ORDER_TYPE } from '../../common/constants/order.constants';
import { ORDER_NOT_RATED, OrderRateStatus } from '../../common/constants/rate-status.constants';
import { Driver } from '../driver/driver.schema';
import { Invoice } from './invoice.schema';
import { Item } from './item.schema';

@Schema({ timestamps: true })
export class Order {
  readonly _id: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Client' })
  clientId: string | mongoose.Types.ObjectId | Client;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Branch' })
  branchId: string | mongoose.Types.ObjectId | Branch;

  @Prop(Invoice)
  invoice: Invoice;

  @Prop({
    type: String,
    enum: ORDER_STATUS,
    default: ORDER_PENDING_STATUS,
  })
  status: string;

  @Prop([Item])
  items: Item[];

  @Prop({ type: [String] })
  clientNotes: string[];

  @Prop({ type: [String] })
  merchantNotes: string[];

  @Prop({ type: [String] })
  rejectedNotes: string[];

  @Prop({ type: Date })
  estimatedPreparationTime: Date;

  @Prop({
    type: String,
    enum: PAYMENT_TYPES,
    default: PAYMENT_TYPES.PAYMENT_CASH_TYPE,
  })
  paymentType: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  localOrder: boolean;

  @Prop({ type: String, enum: ORDER_TYPE, default: ORDER_TYPE.ORDER_DINING })
  orderType: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  orderCreatedBy: string | mongoose.Types.ObjectId | User;

  @Prop({ type: String, unique: true })
  orderRefId: string;

  @Prop({ type: Number, unique: true })
  orderSeqId: number;

  @Prop({ type: String, enum: OrderRateStatus, default: ORDER_NOT_RATED })
  rateStatus: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Table', required: false })
  tableId?: string | mongoose.Types.ObjectId | Table;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Coupon', required: false })
  couponId?: string | mongoose.Types.ObjectId | Coupon;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'DeliveryProvider', required: false })
  deliveryProviderId?: string | mongoose.Types.ObjectId | DeliveryProvider;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Driver',
    required: false,
  })
  driverId?: string | mongoose.Types.ObjectId | Driver;

  @Prop({ type: Address })
  address?: Address;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
