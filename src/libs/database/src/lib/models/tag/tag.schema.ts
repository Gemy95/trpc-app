import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Category } from '../category/category.schema';
import { ACTIVE, STATUS } from '../../common/constants/status.constants';

const { Types } = mongoose.Schema;

export type TagDocument = Tag & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class TagTranslation {
  @Prop({ type: String })
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: true,
})
export class Tag {
  readonly _id: string;

  @Prop({ type: String, trim: true })
  name: string;

  @Prop([String])
  search: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Category | string;

  @Prop({ type: String, trim: true, enum: STATUS, default: ACTIVE })
  status: string;

  @Prop([TagTranslation])
  translation: TagTranslation[];

  @Prop({ type: Boolean })
  client_visibility: boolean;

  @Prop({ type: Boolean })
  stores_visibility: boolean;

  @Prop({ type: Boolean, default: false })
  new: boolean;

  @Prop({ type: String })
  image: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.pre<TagDocument>('save', function (next) {
  if (this.isModified('name') || this.isModified('translation')) {
    let searchList = [...this.name.toLowerCase().split(' ')];
    this.translation.forEach((t) => (searchList = [...searchList, ...t.name.toLowerCase().split(' ')]));
    this.search = [...new Set(searchList)];
  }
  next();
});
TagSchema.index({
  search: 1,
});
