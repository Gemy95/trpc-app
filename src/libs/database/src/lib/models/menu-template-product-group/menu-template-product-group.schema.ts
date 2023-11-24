import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ProductGroup } from '../product-group/product-group.schema';

export type MenuTemplateProductGroupDocument = MenuTemplateProductGroup & Document;

@Schema({ _id: true, timestamps: true })
export class MenuTemplateProductGroup extends ProductGroup {}

export const MenuTemplateProductGroupSchema = SchemaFactory.createForClass(MenuTemplateProductGroup);
