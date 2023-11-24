import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { DiscountTypes, FIXED } from '../../common/constants/discount.constants';

export type DiscountDocument = Discount & Document;

@Schema({ _id: true, timestamps: true })
export class Discount {
  readonly _id: string | mongoose.Types.ObjectId;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String, enum: DiscountTypes, default: FIXED })
  type: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
