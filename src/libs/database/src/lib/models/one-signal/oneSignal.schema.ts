import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

import { Branch } from '..';

const { Types } = mongoose.Schema;

export type OneSignalDocument = OneSignal & Document;

export enum OneSignalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

@Schema({
  timestamps: true,
})
export class OneSignal {
  @Prop({ trim: true })
  readonly UUID: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch' })
  branchId: Branch | string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isAdmin: boolean;
}

export const OneSignalSchema = SchemaFactory.createForClass(OneSignal);
