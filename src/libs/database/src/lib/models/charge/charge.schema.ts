import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChargeDocument = Charge & Document;

@Schema({
  timestamps: true,
  _id: false,
})
export class ChargeTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: true,
})
export class Charge {
  @Prop({ trim: true })
  name: string;

  @Prop()
  is_active: boolean;

  @Prop({ trim: true })
  type: string;

  @Prop()
  amount: number;

  @Prop([ChargeTranslation])
  translation: ChargeTranslation[];
}

export const ChargeSchema = SchemaFactory.createForClass(Charge);
