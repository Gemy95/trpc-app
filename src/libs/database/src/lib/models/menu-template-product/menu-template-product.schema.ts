import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from '../product/product.schema';

export type MenuTemplateProductDocument = MenuTemplateProduct & Document;

@Schema({ _id: true, timestamps: true })
export class MenuTemplateProduct extends Product {
  @Prop({ type: Array<string | Types.ObjectId>, required: true })
  menuTemplateProductGroupsIds: string[] | mongoose.Types.ObjectId[];
}

export const MenuTemplateProductSchema = SchemaFactory.createForClass(MenuTemplateProduct);
