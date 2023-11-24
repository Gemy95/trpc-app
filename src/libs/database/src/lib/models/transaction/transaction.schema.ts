import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TRANSACTION_TYPE } from '../../common/constants/transaction.constants';
import { Merchant } from '../merchant/merchant.schema';
import { Order } from '../order/order.schema';
import { Client } from '..';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: String, unique: true })
  operationId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  tax: number;

  @Prop({ type: Number })
  commission: number;

  @Prop({ type: Types.ObjectId, ref: Merchant.name })
  to: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Client.name })
  from: string | Types.ObjectId;

  @Prop({ type: String, enum: TRANSACTION_TYPE })
  operationType: string;

  @Prop({ type: Types.ObjectId, ref: Order.name })
  orderId: string | Types.ObjectId;

  @Prop({ type: String })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
