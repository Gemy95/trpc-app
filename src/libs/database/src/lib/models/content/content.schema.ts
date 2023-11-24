import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ContentDocument = Content & Document;

export enum ContentType {
  MERCHANT_PRIVACY = 'MERCHANT_PRIVACY',
  OWNER_PRIVACY = 'OWNER_PRIVACY',
  CLIENT_PRIVACY = 'CLIENT_PRIVACY',
  CLIENT_TERMS = 'CLIENT_TERMS',
  MERCHANT_TERMS = 'MERCHANT_TERMS',
  OWNER_TERMS = 'OWNER_TERMS',
  CLIENT_FAQ = 'CLIENT_FAQ',
  MERCHANT_FAQ = 'MERCHANT_FAQ',
  OWNER_FAQ = 'OWNER_FAQ',
}

@Schema()
export class TranslationContent {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  text: string;
}

@Schema()
export class QuestionAndAnswers {
  @Prop({ type: String })
  question: string;

  @Prop({ type: [String] })
  answer: string;
}

@Schema({ timestamps: true })
export class Content {
  readonly _id: string;

  @Prop({ type: String })
  text: string;

  @Prop({ type: Array<TranslationContent> })
  translation: TranslationContent[];

  @Prop()
  content_type: ContentType;

  @Prop()
  faq?: QuestionAndAnswers[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
