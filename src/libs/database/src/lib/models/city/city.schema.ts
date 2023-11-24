import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Location } from '../location/location.schema';
import { ACTIVE, STATUS } from '../../common/constants/status.constants';

const { Types } = mongoose.Schema;
export type CityDocument = City & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class CityTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: true,
})
export class City {
  readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  country: string;

  @Prop({ trim: true, enum: STATUS, default: ACTIVE })
  client_status: string;

  @Prop({ trim: true, enum: STATUS, default: ACTIVE })
  stores_status: string;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: Number })
  longitudeDelta: number;

  @Prop({ type: Number })
  latitudeDelta: number;

  @Prop([String])
  search: string[];

  @Prop([CityTranslation])
  translation: CityTranslation[];

  @Prop({ type: Boolean, default: false })
  isEnabledReservation: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ location: '2dsphere' });

CitySchema.pre<CityDocument>('save', function (next) {
  if (this.isModified('name') || this.isModified('translation')) {
    let searchList = [...this.name.toLowerCase().split(' ')];
    this.translation.forEach((t) => (searchList = [...searchList, ...t.name.toLowerCase().split(' ')]));
    this.search = [...new Set(searchList)];
  }
  next();
});
CitySchema.index({
  search: 1,
});
