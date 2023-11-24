import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { Order } from './order.schema';

@Schema({ timestamps: true, _id: true })
export class DraftOrder extends Order {}

export const DraftOrderSchema = SchemaFactory.createForClass(DraftOrder);
