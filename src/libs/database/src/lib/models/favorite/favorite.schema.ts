import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Branch } from '../branch/branch.schema';
import { Client } from '../client/client.schema';
import { Merchant } from '../merchant/merchant.schema';

export type FavoriteDocument = Favorite & Document;

@Schema({
  timestamps: true,
})
export class Favorite {
  readonly _id: string | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Client' })
  clientId: string | mongoose.Types.ObjectId | Client;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Merchant' })
  merchantId: string | mongoose.Types.ObjectId | Merchant;

  @Prop({ required: false, type: mongoose.Types.ObjectId, ref: 'Branch' })
  branchId?: string | mongoose.Types.ObjectId | Branch;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
