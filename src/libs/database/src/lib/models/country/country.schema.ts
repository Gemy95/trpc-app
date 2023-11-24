import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ACTIVE, STATUS } from '../../common/constants/status.constants';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true, _id: false })
export class CountryTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema({ timestamps: true })
export class Country {
  readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: String, trim: true, enum: STATUS, default: ACTIVE })
  client_status: string;

  @Prop({ type: String, trim: true, enum: STATUS, default: ACTIVE })
  stores_status: string;

  @Prop({ trim: true })
  code: string;

  @Prop([String])
  search: string[];

  @Prop([CountryTranslation])
  translation: CountryTranslation[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);

CountrySchema.pre<CountryDocument>('save', function (next) {
  if (this.isModified('name') || this.isModified('translation')) {
    let searchList = [...this.name.toLowerCase().split(' ')];
    this.translation.forEach((t) => (searchList = [...searchList, ...t.name.toLowerCase().split(' ')]));
    this.search = [...new Set(searchList)];
  }
  next();
});

CountrySchema.index({ search: 1 });
