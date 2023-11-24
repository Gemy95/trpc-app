import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { STATUS } from '../../common/constants/status.constants';
import { Merchant } from '../merchant/merchant.schema';
const { Types } = mongoose.Schema;

@Schema()
export class GroupOptionTranslation {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema()
export class GroupOption {
  readonly _id?: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  extraPrice: number;

  @Prop([GroupOptionTranslation])
  translation: GroupOptionTranslation[];

  @Prop({ type: Number })
  serialDisplayNumber: number;
}

@Schema({ timestamps: true, _id: false })
export class ProductCategoryTranslation {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema({ timestamps: true })
export class ProductGroup {
  readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: Number })
  minimum: number;

  @Prop({ type: Number })
  maximum: number;

  @Prop([GroupOption])
  options: GroupOption[];

  @Prop({ type: Types.ObjectId || String, ref: 'Merchant' })
  merchantId: mongoose.Types.ObjectId | Merchant | string;

  @Prop([ProductCategoryTranslation])
  translation: ProductCategoryTranslation[];

  @Prop({ type: Boolean })
  required: boolean;

  @Prop({ type: String, enum: STATUS, default: STATUS.ACTIVE })
  status: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Number })
  serialDisplayNumber: number;
}

export const ProductGroupSchema = SchemaFactory.createForClass(ProductGroup);
