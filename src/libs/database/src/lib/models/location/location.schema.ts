import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ type: [Number] })
  coordinates: number[];
}
