import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Branch } from '../branch/branch.schema';
import { Merchant } from '../merchant/merchant.schema';

const { Types } = mongoose.Schema;

@Schema({ timestamps: true })
export class UpdateRequest {
  @Prop({ type: String, enum: [Merchant.name, Branch.name] })
  type: string;

  @Prop({ required: true, type: Types.ObjectId, unique: true })
  mainDocumentId: string;

  @Prop({ type: Object, required: true })
  data: any;
}

export const UpdateRequestSchema = SchemaFactory.createForClass(UpdateRequest);
