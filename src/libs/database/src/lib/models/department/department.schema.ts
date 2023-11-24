import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true, _id: false })
export class DepartmentTranslation {
  @Prop({ type: String, trim: true })
  _lang: string;

  @Prop({ trim: true, type: String })
  name: string;
}

@Schema({ timestamps: true })
export class Department {
  readonly _id: string;

  @Prop({ trim: true, type: String })
  name: string;

  @Prop({ type: String, trim: true })
  uuid: string;

  @Prop({ type: String, trim: true })
  image: string;

  @Prop([DepartmentTranslation])
  translation: DepartmentTranslation[];

  @Prop({ type: [String] })
  oneSignalTags: string[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
