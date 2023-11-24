import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type PaytabsTransactionDocument = PaytabsTransaction & Document;

@Schema({ strict: false, _id: true, timestamps: true })
export class PaytabsTransaction {
  readonly _id: string;
}

export const PaytabsTransactionSchema = SchemaFactory.createForClass(PaytabsTransaction);
