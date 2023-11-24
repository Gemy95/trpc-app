import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const { Types } = mongoose;

@Schema({ timestamps: true })
export class Rating {
  readonly _id: string;

  @Prop({ type: Types.ObjectId, ref: 'RatingScale', required: true })
  rating: string;

  @Prop({ type: String })
  extraNote: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: false })
  branch: string;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: false })
  order: string;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  client: string;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: false })
  merchant: string;

  @Prop({ type: String, required: false })
  comment: string;

  @Prop({ type: Boolean, default: true })
  is_public: boolean;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
