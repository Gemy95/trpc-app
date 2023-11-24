import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketTagDocument = TicketTag & Document;

@Schema({
  timestamps: true,
  _id: false,
})
class Translation {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  description: string;
}

@Schema({
  timestamps: true,
})
export class TicketTag {
  @Prop({ trim: true })
  description: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop([Translation])
  translation: Translation[];
}

export const TicketTagSchema = SchemaFactory.createForClass(TicketTag);
