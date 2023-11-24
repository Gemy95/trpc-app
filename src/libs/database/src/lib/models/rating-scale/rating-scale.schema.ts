import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

class Translation {
  @Prop()
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema({ timestamps: true })
export class RatingScale {
  @Prop({ type: String, required: true })
  name: string;

  @Prop([Translation])
  translation: Translation[];

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Number, required: true })
  level: number;
}

export const RatingScaleSchema = SchemaFactory.createForClass(RatingScale);
