import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

import { VEHICLE_COLORS, VEHICLE_TYPES } from '../../common/constants/vehicle-types.constant';

@ObjectType()
@Schema({ _id: false, versionKey: false })
export class VehicleImage {
  @Prop({ type: String, required: true, trim: true })
  url: string;
}

export const VehicleImageSchema = SchemaFactory.createForClass(VehicleImage);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Vehicle {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'DeliveryProvider' })
  deliveryProviderId: mongoose.Types.ObjectId | string;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: false, ref: 'VehicleBrand' })
  vehicle_brand_id: mongoose.Types.ObjectId | string;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: false, ref: 'VehicleModel' })
  vehicle_model_id: mongoose.Types.ObjectId | string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    enum: VEHICLE_COLORS,
    default: VEHICLE_COLORS.red,
  })
  @Prop({ type: String, required: true })
  color: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  seats: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: false, ref: 'VehicleYear' })
  vehicle_year_id: mongoose.Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  mileage: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  price: number;

  // @Field(() => [VehicleImage], { nullable: true })
  @Prop({
    type: [VehicleImageSchema],
  })
  images: VehicleImage[];

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  status: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ type: Boolean, required: true, default: true })
  availability: boolean;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  plate_number: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    enum: VEHICLE_TYPES,
    default: VEHICLE_TYPES.car,
  })
  vehicle_type: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export type VehicleDocument = Vehicle & Document;

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
