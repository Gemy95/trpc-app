import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DAYS, RESERVATION_USER_TYPES, USER_TYPES } from '../../common/constants/branch.constants';
import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import {
  RESERVATION_STATUS,
  RESERVATION_PENDING_STATUS,
  RESERVATION_TYPE,
  RESERVATION_PLATFORM,
} from '../../common/constants/reservation.constants';
import { Client } from '../client/client.schema';
import { User } from '../common/user.schema';
import { Invoice } from '../order/invoice.schema';
import { Table } from '..';
const { Types } = mongoose.Schema;

@Schema()
export class ReservationItem {
  @Prop({ type: Number })
  count: number;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: string;

  @Prop({ type: [Object] })
  groups: any[];
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Merchant' })
  merchant: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Branch' })
  branch: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Client', required: true })
  client: string | mongoose.Types.ObjectId | Client;

  @Prop({ type: String })
  clientName: string;

  @Prop({ type: String })
  clientMobile: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  reservationCreatedBy: string | mongoose.Types.ObjectId | User;

  @Prop({ type: [String] })
  clientDetails: string[];

  @Prop({
    type: String,
    enum: RESERVATION_TYPE,
    default: RESERVATION_TYPE.ORDER_OFFLINE_BOOK,
  })
  type: string;

  @Prop({
    type: String,
    enum: RESERVATION_STATUS,
    default: RESERVATION_PENDING_STATUS,
  })
  status: string;

  @Prop({ type: Date })
  dateTime: Date;

  @Prop({ type: String, enum: DAYS })
  day: string;

  @Prop({ type: String })
  timeFrom: string;

  @Prop({ type: String })
  timeTo: string;

  @Prop({ type: Number })
  numberOfGuests: number;

  @Prop({ type: Number })
  numberOfAdultsGuests: number;

  @Prop({ type: Number })
  numberOfChildrenGuests: number;

  @Prop({ type: String })
  clientNotes: string;

  @Prop({ type: String, enum: PAYMENT_TYPES })
  paymentType: string;

  @Prop({ type: Boolean })
  isWaitingList: boolean;

  @Prop({ type: String })
  employeeNotes: string;

  @Prop(Invoice)
  invoice: Invoice;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  // @Prop([Item])
  // items: Item[];

  @Prop({ required: true, type: [Types.ObjectId], ref: 'Table' })
  tablesIds: Table[] | string[];

  @Prop({ type: String, unique: true })
  reservationRefId: string;

  @Prop({
    type: String,
    enum: RESERVATION_PLATFORM,
    default: RESERVATION_PLATFORM.WEB,
  })
  platform?: string;

  @Prop({ type: Date })
  endDateTime?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
