import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VehicleModelDocument = VehicleModel & Document;

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class VehicleModel {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  model_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  model_description?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: false, ref: 'VehicleBrand' })
  vehicle_brand_id: mongoose.Types.ObjectId | string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const VehicleModelSchema = SchemaFactory.createForClass(VehicleModel);
