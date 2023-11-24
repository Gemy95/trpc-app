import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import { OTP_VERIFICATION_TYPE } from '../../common/constants/users.types';

export type SettingDocument = Setting & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Setting {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, enum: OTP_VERIFICATION_TYPE })
  otp_verify_type?: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  minDistance?: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  maxDistance?: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  amount?: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, enum: AMOUNT_TYPE, /*default: AMOUNT_TYPE.FIXED,*/ required: false })
  type?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, index: { unique: true } /*enum: ['verification', 'Branch']*/ })
  modelName?: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
