import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true, _id: false })
export class OnBoardingTranslation {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;
}

@Schema({ timestamps: true, _id: false })
export class BoardingStep {
  @Prop({ trim: true })
  image: string;

  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  stepNum: number;

  @Prop([OnBoardingTranslation])
  translation: OnBoardingTranslation[];
}

export enum ForTypeEnum {
  CLIENTS_MOBILE = 'CLIENTS_MOBILE',
  CLIENTS_WEB = 'CLIENTS_WEB',
  CLIENTS_DESKTOP = 'CLIENTS_DESKTOP',
  MERCHANTS_MOBILE = 'MERCHANTS_MOBILE',
  MERCHANTS_WEB = 'MERCHANTS_WEB',
  MERCHANTS_DESKTOP = 'MERCHANTS_DESKTOP',
  DELIVERY_MOBILE = 'DELIVERY_MOBILE',
  DELIVERY_WEB = 'DELIVERY_WEB',
}

@Schema({ timestamps: true })
export class OnBoarding extends Document {
  @Prop({ type: String, enum: ForTypeEnum, unique: true })
  for_type: ForTypeEnum;

  @Prop({ type: Array<BoardingStep>, validate: [(val: any[]) => val.length <= 4, '{PATH} exceeds the limit of 4'] })
  steps: BoardingStep[];
}

export const OnBoardingSchema = SchemaFactory.createForClass(OnBoarding);
