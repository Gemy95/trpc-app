import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from '../common/user.schema';

@ObjectType()
@Schema({ strict: false, timestamps: true })
export class Review {
  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: true,
    enum: ['Merchant', 'Product', 'Branch', 'DeliveryProvider', 'Driver'],
  })
  modelName: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: true, refPath: 'modelName' })
  reference: mongoose.Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ type: mongoose.Types.ObjectId, required: false, ref: 'User' })
  updatedBy: mongoose.Types.ObjectId | User;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: true,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending',
  })
  approveStatus: string;

  @Field(() => String, { nullable: true })
  public readonly _id: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
