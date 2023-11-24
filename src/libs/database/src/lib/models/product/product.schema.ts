import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { PRODUCT_PENDING_STATUS, PRODUCT_STATUS, RELEASE_STATUS, STAGING_STATUS } from '../../common/constants/product';
import { ACTIVE, STATUS } from '../../common/constants/status.constants';
import { ProductGroup } from '../product-group/product-group.schema';
import { ProductCategory } from '../productCategory/productCategory.schema';
import { Merchant } from '../merchant/merchant.schema';
import { Branch } from '../branch/branch.schema';
import { User } from '../common/user.schema';
const { Types } = mongoose.Schema;
import { MealsTime } from './meals-time.schema';
import { Tag } from '../tag/tag.schema';

export type ProductDocument = Product & Document;

@Schema({ _id: false, timestamps: false })
export class ProductTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ trim: true, type: String })
  name: string;

  @Prop({ trim: true, type: String })
  description: string;
}

@Schema({ _id: false, timestamps: false })
export class ProductImageTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ trim: true, type: String })
  title: string;

  @Prop({ trim: true, type: String })
  description: string;
}

@Schema({ _id: false, timestamps: false })
export class ProductImage {
  @Prop({ trim: true, required: true })
  url: string;

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Boolean, default: false })
  new?: boolean;

  @Prop([ProductImageTranslation])
  translation?: ProductImageTranslation[];
}

@Schema({ timestamps: true, _id: false })
export class ProductGroupsOptionsOrders {
  _id: string;

  @Prop({ type: Number })
  serialDisplayNumber: number;
}

@Schema({ timestamps: true, _id: false })
export class ProductGroupsOrders {
  @Prop({ type: String })
  id: string;

  @Prop({ type: Number })
  serialDisplayNumber: number;

  @Prop({ type: Array<ProductGroupsOptionsOrders>, required: false })
  options: ProductGroupsOptionsOrders[];
}

@Schema({ timestamps: true })
export class Product {
  readonly _id: string;

  @Prop({ type: String, trim: true })
  name: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: Number })
  preparationTime: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProductGroup' }] })
  productGroupsIds: mongoose.Types.ObjectId[] | ProductGroup[];

  @Prop({ type: Array<ProductGroupsOrders> })
  productGroupsOrders: ProductGroupsOrders[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProductCategory' }] })
  categoriesIds: mongoose.Types.ObjectId[] | ProductCategory[];

  @Prop({ type: Types.ObjectId, ref: 'Merchant' })
  merchantId: mongoose.Types.ObjectId | Merchant;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Branch' }] })
  branchesIds: mongoose.Types.ObjectId[] | Branch[];

  @Prop([ProductImage])
  images: ProductImage[];

  @Prop(ProductImage)
  mainImage: ProductImage;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  numberOfSale: number;

  @Prop([ProductTranslation])
  translation: ProductTranslation[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, enum: PRODUCT_STATUS, default: PRODUCT_PENDING_STATUS })
  build_status: string;

  @Prop({ type: String, enum: RELEASE_STATUS, default: STAGING_STATUS })
  release_status: string;

  @Prop({ type: String, enum: STATUS, default: ACTIVE })
  status: string;

  @Prop({ type: Number })
  calories: number;

  @Prop({ type: Number })
  serialDisplayNumber: number;

  @Prop({ type: Boolean, default: true })
  inReview: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Discount' })
  discount: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: mongoose.Types.ObjectId | User;

  @Prop({ type: [String], required: false })
  notes?: string[];

  @Prop([MealsTime])
  mealsTime?: MealsTime[];

  @Prop({ type: Number })
  remainingQuantity: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], required: false })
  tagsIds: string[] | mongoose.Types.ObjectId[] | Tag[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
