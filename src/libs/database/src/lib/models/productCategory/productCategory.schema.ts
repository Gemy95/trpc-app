import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../common/user.schema';
import { Branch } from '../branch/branch.schema';
import { Merchant } from '../merchant/merchant.schema';
// import { PRODUCT_CATEGORY_STATUS } from '../../product-category/dto/product-category.enum';

const { Types } = mongoose.Schema;
export type ProductCategoryDocument = ProductCategory & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class ProductGroupTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: true,
})
export class ProductCategory {
  readonly _id?: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: string | User;

  // @Prop({
  //   type: String,
  //   enum: PRODUCT_CATEGORY_STATUS,
  //   default: PRODUCT_CATEGORY_STATUS.ACTIVE,
  // })
  // status: string;

  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Branch' }] })
  // branches: string[];

  @Prop({ type: Types.ObjectId, ref: 'Merchant' })
  merchantId: string;

  @Prop({ type: String })
  image: string;

  @Prop()
  search: string[];

  @Prop([ProductGroupTranslation])
  translation: ProductGroupTranslation[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Number })
  serialDisplayNumber: number;
  status: string;
}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory);

ProductCategorySchema.pre<ProductCategoryDocument>('save', function (next) {
  if (this.isModified('name') || this.isModified('translation')) {
    let searchList = [...this.name.toLowerCase().split(' ')];
    this.translation.forEach((t) => (searchList = [...searchList, ...t.name.toLowerCase().split(' ')]));
    this.search = [...new Set(searchList)];
  }
  next();
});
ProductCategorySchema.index({
  search: 1,
});
