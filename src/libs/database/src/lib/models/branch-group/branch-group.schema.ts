import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { City } from '../city/city.schema';
import { Location } from '../location/location.schema';

export type BranchGroupDocument = BranchGroup & Document;

@Schema({ _id: false })
export class BranchGroupTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({ timestamps: true })
export class BranchGroup {
  public readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ type: Location })
  location: Location;

  @Prop([BranchGroupTranslation])
  translation: BranchGroupTranslation[];

  @Prop({ required: true, type: Types.ObjectId || String, ref: 'City' })
  city: string | City | mongoose.Types.ObjectId;
}

export const BranchGroupSchema = SchemaFactory.createForClass(BranchGroup);

BranchGroupSchema.index({ location: '2dsphere' });
