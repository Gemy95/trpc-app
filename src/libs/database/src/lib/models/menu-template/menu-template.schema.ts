import { PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from '../product/product.schema';
import { ProductGroup } from '../product-group/product-group.schema';
import { Category } from '../category/category.schema';
import { ProductCategory } from '../productCategory/productCategory.schema';

export type MenuTemplateDocument = MenuTemplate & Document;

@Schema({ _id: false, timestamps: false })
export class TranslationMenuTemplate {
  @Prop({ trim: true })
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema({ _id: true, timestamps: true })
export class ProductCategoryAndProducts extends PartialType(ProductCategory) {
  @Prop({ type: Array<string | Types.ObjectId>, required: true })
  menuTemplateProductsIds: string[] | mongoose.Types.ObjectId[];
}

@Schema({ timestamps: true })
export class MenuTemplate {
  public readonly _id?: string;

  @Prop({ trim: true, /* unique: true,*/ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  categoryId: string | Types.ObjectId | Category;

  @Prop({ type: Array<ProductCategoryAndProducts>, required: true })
  productCategoryAndProducts: ProductCategoryAndProducts[];

  @Prop({ type: Array<TranslationMenuTemplate>, required: false })
  translation: TranslationMenuTemplate[];
}

export const MenuTemplateSchema = SchemaFactory.createForClass(MenuTemplate);
