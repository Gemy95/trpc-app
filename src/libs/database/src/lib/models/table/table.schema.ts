import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import {
  TABLE_STATUS,
  TABLE_AVAILABLE_STATUS,
  TABLE_TYPE,
  TABLE_LOCATION,
} from '../../common/constants/table.constants';
import { Branch } from '../branch/branch.schema';

@Schema()
export class TableTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: [String], enum: TABLE_LOCATION, default: [] })
  location: string[];

  @Prop({ trim: true, type: String })
  description: string;
}

@Schema({ _id: false, timestamps: false })
export class TableImageTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ trim: true, type: String })
  title: string;

  @Prop({ trim: true, type: String })
  description: string;
}

@Schema({ _id: false, timestamps: false })
export class TableImage {
  @Prop({ trim: true, required: true })
  url: string;

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop([TableImageTranslation])
  translation?: TableImageTranslation[];
}

@Schema({ _id: false })
export class TableDuration {
  @Prop({ type: String })
  startAt: string;

  @Prop({ type: String })
  endAt: string;
}

@Schema({})
export class TableWorkingHours {
  @Prop({ type: String })
  day: string;

  @Prop([TableDuration])
  durations: TableDuration[];
}

@Schema({ timestamps: true })
export class Table {
  readonly _id: string;

  @Prop({ type: String, trim: true })
  number: string;

  @Prop({ type: Number })
  floor: number;

  @Prop({ type: Number })
  capacity: number;

  @Prop({ type: Boolean, default: false })
  vip: boolean;

  @Prop({ type: Number, default: 0 })
  extraPrice: number;

  @Prop({ type: String, trim: true })
  name: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: String, enum: TABLE_TYPE, default: TABLE_TYPE.TABLE })
  type: string;

  @Prop({ type: String, enum: TABLE_STATUS, default: TABLE_AVAILABLE_STATUS })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Branch.name })
  branchId: string | Types.ObjectId;

  @Prop({
    type: [String],
    enum: TABLE_LOCATION,
    default: [TABLE_LOCATION.EAST],
  })
  location: string[];

  @Prop([TableTranslation])
  translation: TableTranslation[];

  @Prop([TableImage])
  images: TableImage[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  // @Prop({ type: Array<TableWorkingHours>, required: false })
  // workingHours: TableWorkingHours[];
}

export const TableSchema = SchemaFactory.createForClass(Table);
