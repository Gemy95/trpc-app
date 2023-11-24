import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

import { DELIVERY_PROVIDER_STATUS, DELIVERY_PROVIDER_TYPES } from '../../common/constants/delivery-provider.constants';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import { VEHICLE_TYPES } from '../../common/constants/vehicle-types.constant';
import { Location } from '../location/location.schema';
import { BankAccount, SocialMedia } from '../merchant/merchant.schema';
import { User } from '../common/user.schema';
import { City } from '../city/city.schema';

export type DeliveryProviderDocument = DeliveryProvider & Document;

@ObjectType()
@Schema({ _id: false, versionKey: false })
export class DeliveryProviderTranslation {
  @Prop({ type: String })
  _lang: string;
  @Prop({ type: String, trim: true })
  name: string;
}
const DeliveryProviderTranslationSchema = SchemaFactory.createForClass(DeliveryProviderTranslation);

@ObjectType()
@Schema({ _id: false, versionKey: false })
export class CommissionDetails {
  @Prop({ trim: true })
  name?: string;

  @Prop({
    type: String,
    enum: AMOUNT_TYPE,
    default: AMOUNT_TYPE.PERCENTAGE,
    required: false,
  })
  type: string;

  @Prop()
  amount: number;
}

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class DeliveryProvider {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProviderOwner' })
  providerOwnerId: string | Types.ObjectId;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false, default: 0 })
  number_of_drivers?: number;

  @Field(() => [String], { nullable: true })
  @Prop({
    type: [String],
    enum: VEHICLE_TYPES,
    default: VEHICLE_TYPES.car,
  })
  vehicle_types: string[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true, trim: true })
  commercial_registration_number: string;

  @Field(() => String, { nullable: true })
  @Prop({ trim: true, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ trim: true, required: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ trim: true, required: true })
  mobile: string;

  @Field(() => [String], { nullable: true })
  @Prop({ required: true, type: [Types.ObjectId], ref: 'City' })
  service_cities: City[] | string[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  logo: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  commercial_image: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  identification_image: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    enum: DELIVERY_PROVIDER_TYPES,
    default: DELIVERY_PROVIDER_TYPES.merchant,
  })
  provider_type: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  description: string;

  // @Field(() => [DeliveryProviderTranslationSchema])
  @Prop({
    type: [DeliveryProviderTranslationSchema],
  })
  translation: DeliveryProviderTranslation[];

  // @Field(() => Location)
  @Prop({ type: Location })
  location: Location;

  @Field(() => [Number], { nullable: true })
  @Prop({ type: [Number] })
  locationDelta: number[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  address: string;

  @Field(() => String, { nullable: true })
  @Prop({ required: false, type: Types.ObjectId || String, ref: 'City' })
  cityId: string | City | mongoose.Types.ObjectId;

  // @Field(() => BankAccount)
  @Prop({ type: BankAccount, required: false })
  bankAccount: BankAccount;

  // @Field(() => SocialMedia)
  @Prop(SocialMedia)
  twitterUrl: SocialMedia;

  // @Field(() => SocialMedia)
  @Prop(SocialMedia)
  facebookUrl: SocialMedia;

  // @Field(() => SocialMedia)
  @Prop(SocialMedia)
  websiteUrl: SocialMedia;

  // @Field(() => SocialMedia)
  @Prop(SocialMedia)
  snapUrl: SocialMedia;

  // @Field(() => SocialMedia)
  @Prop(SocialMedia)
  tiktokUrl: SocialMedia;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    enum: DELIVERY_PROVIDER_STATUS,
    default: DELIVERY_PROVIDER_STATUS.pending,
  })
  status: string;

  // @Field(() => CommissionDetails)
  @Prop({ type: CommissionDetails, required: false })
  commission_per_order: CommissionDetails;

  @Field(() => String, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: User | mongoose.Types.ObjectId;

  @Field(() => Boolean, { nullable: true })
  @Prop({ type: Boolean, default: true, required: false })
  inReview: boolean;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], required: false })
  notes?: string[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const DeliveryProviderSchema = SchemaFactory.createForClass(DeliveryProvider);
