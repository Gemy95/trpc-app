import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ACTIVE, STATUS } from '../../common/constants/status.constants';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class CategoryTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: true,
})
export class Category {
  readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: String, enum: STATUS, default: ACTIVE })
  status: string;

  @Prop({ type: String })
  search: string[];

  @Prop({ type: String })
  image: string;

  @Prop({ type: Boolean })
  stores_visibility: boolean;

  @Prop({ type: Boolean })
  client_visibility: boolean;

  @Prop([CategoryTranslation])
  translation: CategoryTranslation[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre<CategoryDocument>('save', function (next) {
  if (this.isModified('name') || this.isModified('translation')) {
    let searchList = [...this.name.toLowerCase().split(' ')];
    this.translation.forEach((t) => (searchList = [...searchList, ...t.name.toLowerCase().split(' ')]));
    this.search = [...new Set(searchList)];
  }
  next();
});
CategorySchema.index({
  search: 1,
});
