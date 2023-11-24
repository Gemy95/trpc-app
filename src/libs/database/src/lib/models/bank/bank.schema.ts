import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type BankDocument = Bank & Document;

@Schema({ _id: false })
export class BankTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({ _id: true, timestamps: true })
export class Bank {
  readonly _id: string;

  @Prop({ trim: true, unique: true, required: true })
  name: string;

  @Prop({ trim: true, required: true })
  logo: string;

  @Prop([BankTranslation])
  translation: BankTranslation[];

  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  country: string;

  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
