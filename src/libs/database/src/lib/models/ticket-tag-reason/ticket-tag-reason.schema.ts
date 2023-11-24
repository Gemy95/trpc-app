import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TagReasonDocument = TagReason & Document;

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
export class TagReason {
  @Prop({ trim: true })
  description: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'TicketTag' })
  tag: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop([Translation])
  translation: Translation[];
}

export const TagReasonSchema = SchemaFactory.createForClass(TagReason);
