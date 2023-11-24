import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  BANK_ACCOUNT_TYPE,
  MENU_UPLOAD_STATUS,
  MERCHANT_STATUS,
  MERCHANT_STATUS_TAGS,
  VISIBILITY_STATUS,
} from '../../common/constants/merchant';
import { AMOUNT_TYPE, ORDER_TYPE } from '../../common/constants/order.constants';
import { Bank } from '../bank/bank.schema';
import { Location } from '../location/location.schema';
import { User } from '../common/user.schema';

const { Types } = mongoose.Schema;

@Schema({ _id: false, timestamps: false })
export class TranslationMerchant {
  @Prop({ trim: true })
  _lang: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;
}

@Schema({ _id: true, timestamps: true })
export class Subscriptions {
  @Prop({ type: Number, required: true, default: 0 })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  started_subscribe_date: Date;

  @Prop({ type: Date, required: true })
  next_subscribe_payment_date: Date;
}
// 1 or 3 or 6 or 12
@Schema({ _id: false, timestamps: false })
export class SocialMedia {
  @Prop({ type: String, required: true, trim: true })
  url: string;

  @Prop({ type: Number, default: 0 })
  visits: number;
}
@Schema({ _id: true, timestamps: true })
export class BankAccount {
  readonly _id?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Bank' })
  bank: string; //| mongoose.Types.ObjectId | Bank;

  @Prop({ type: String, required: true })
  nameOfPerson: string;

  @Prop({ type: String, required: true })
  accountNumber: string;

  @Prop({ type: String, required: true })
  iban: string;

  @Prop({
    type: String,
    enum: BANK_ACCOUNT_TYPE,
    default: BANK_ACCOUNT_TYPE.individual,
  })
  accountType: string;

  @Prop({ type: String, required: false, trim: true })
  accountImageUrl?: string;
}

@Schema({ _id: true, timestamps: true })
export class MerchantCommissions {
  @Prop({ type: String, enum: AMOUNT_TYPE, default: AMOUNT_TYPE.PERCENTAGE })
  type: string;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({
    type: String,
    enum: ORDER_TYPE,
    default: ORDER_TYPE.ORDER_OFFLINE,
    unique: true,
  })
  orderType: string;
}

@Schema({ _id: false, timestamps: false })
export class MenuUploadImage {
  @Prop({ type: String, required: true, trim: true })
  url: string;
}

@Schema({ _id: false, timestamps: false })
export class MenuUpload {
  @Prop({ type: String, required: true, trim: true })
  mobile: string;

  @Prop([MenuUploadImage])
  images: MenuUploadImage[];

  @Prop({ type: String, required: false, trim: true })
  notes?: string;
}

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Merchant {
  readonly _id: string;
  readonly createdAt: Date;

  @Prop({ type: String, trim: true, lowercase: true, required: false })
  name: string;

  @Prop({ type: String, trim: true, lowercase: true, required: false })
  description: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  commercialRegistrationNumber: string;

  @Prop({ type: String, trim: true, required: false })
  commercialName: string;

  @Prop({ type: Number, default: 0, required: false })
  branchesNumber: number;

  @Prop({ type: Boolean, required: false })
  hasDeliveryService: boolean;

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  uuid: string;

  // @Prop({ type: String, enum: BUILD_STATUS, default: BUILD_STATUS.PENDING_STATUS })
  // build_status: string;

  // @Prop({ type: String, enum: RELEASE_STATUS, default: RELEASE_STATUS.STAGING_STATUS })
  // release_status: string;

  @Prop({
    type: String,
    enum: MERCHANT_STATUS,
    default: MERCHANT_STATUS.PENDING_STATUS,
  })
  status: string;

  @Prop({
    type: String,
    enum: MERCHANT_STATUS_TAGS,
    default: MERCHANT_STATUS_TAGS.UNDER_REVIEW_STATUS,
    required: false,
  })
  status_tags?: string;

  @Prop({
    type: String,
    enum: VISIBILITY_STATUS,
    default: VISIBILITY_STATUS.OFFLINE_STATUS,
  })
  visibility_status: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Owner' })
  ownerId: string;

  @Prop({ type: String, required: false })
  logo: string;

  @Prop({ type: String, required: false })
  identificationImage: string;

  @Prop({ type: String, required: false })
  commercialIdImage: string;

  @Prop({ type: Number, required: false })
  balance: number;

  @Prop({ type: Location, required: false })
  location: Location;

  @Prop({ type: [Number], required: false })
  locationDelta: number[];

  @Prop({ type: [String], required: false })
  notes?: string[];

  @Prop({ type: Boolean, default: false, required: false })
  isDeleted: boolean;

  @Prop({ type: Array<TranslationMerchant>, required: false })
  translation: TranslationMerchant[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required: true })
  categoriesIds: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], required: true })
  tagsIds: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'City' })
  cityId: string;

  @Prop({ type: Number, required: false })
  productsPriceRange: number;

  @Prop(SocialMedia)
  twitterUrl: SocialMedia;

  @Prop(SocialMedia)
  facebookUrl: SocialMedia;

  @Prop(SocialMedia)
  websiteUrl: SocialMedia;

  @Prop(SocialMedia)
  snapUrl: SocialMedia;

  @Prop(SocialMedia)
  tiktokUrl: SocialMedia;

  @Prop({ type: String, required: false })
  mobile: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: User | mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: true, required: false })
  inReview: boolean;

  @Prop({ type: BankAccount, required: false })
  bankAccount: BankAccount;

  @Prop({ type: Subscriptions, required: false })
  subscriptions: Subscriptions;

  @Prop({ required: false, type: Types.ObjectId, ref: 'MenuTemplate' })
  menuTemplateId?: string;

  @Prop({ type: Array<MerchantCommissions>, required: false })
  commissions?: MerchantCommissions[];

  @Prop({ type: Number, default: 0 })
  minimum_delivery_price: number;

  @Prop({ type: Number, default: 0 })
  lowestPriceToOrder: number;

  @Prop({ type: String, enum: MERCHANT_STATUS, required: false })
  status_before_deleted?: string;

  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date;

  @Prop({ type: String, enum: MENU_UPLOAD_STATUS, required: false })
  menu_upload_status: string;

  @Prop({ type: MenuUpload, required: false })
  menuUpload: MenuUpload;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
