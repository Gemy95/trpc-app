import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ONE_SIGNAL_FILTERS, PLATFORM, USER_TYPES, ACTION } from '../../common/constants/notification.constant';
import { Branch } from '../branch/branch.schema';
import { User } from '../common/user.schema';
import { Merchant } from '../merchant/merchant.schema';
import { Product } from '../product/product.schema';
import { Location } from '../location/location.schema';

@Schema({ _id: false, timestamps: false })
export class lang {
  @Prop({ trim: true })
  ar: string;

  @Prop({ trim: true })
  en: string;
}

@Schema({ timestamps: true })
export class Notification {
  readonly _id: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  sender?: User | mongoose.Types.ObjectId;

  @Prop({ type: String, enum: USER_TYPES, required: true })
  senderType: string;

  @Prop([{ type: mongoose.Types.ObjectId, ref: 'User' }])
  receiver?: User | User[] | mongoose.Types.ObjectId | mongoose.Types.ObjectId[];

  @Prop({ type: String, enum: ACTION, required: false })
  action?: string;

  @Prop({ type: mongoose.Types.ObjectId, refPath: 'action', required: false })
  target?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Branch', required: false })
  branch?: Branch | mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Merchant', required: false })
  merchant?: Merchant | mongoose.Types.ObjectId;

  @Prop({ type: [String], enum: PLATFORM, required: false })
  platform?: string[];

  @Prop({ type: lang, required: true })
  content: lang;

  @Prop({ type: lang, required: true })
  title: lang;

  @Prop({ type: lang, required: false })
  subtitle?: lang;

  @Prop({ trim: true, required: false })
  icon?: string;

  @Prop({ trim: true, required: false })
  sound?: string;

  @Prop({ trim: true, required: false })
  oneSignalId: string;

  @Prop({ type: [String], enum: ONE_SIGNAL_FILTERS, required: false })
  oneSignalFilters?: string[];

  @Prop({ type: Boolean, default: false })
  useOneSignal?: boolean;

  @Prop({ type: Location })
  coordinates?: Location;

  @Prop({ type: Number, required: false })
  radius?: number;

  @Prop({ type: [String], required: false })
  notes?: string[];

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product', required: false })
  product?: Product | mongoose.Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
