import { Prop, Schema } from '@nestjs/mongoose';
import { PRODUCT_MEALS_TIME } from '../../common/constants/product';

@Schema({ _id: false, timestamps: false })
export class Time {
  @Prop({ type: String, required: true, trim: true })
  from: string;

  @Prop({ type: String, required: true, trim: true })
  to: string;
}

@Schema({ _id: false, timestamps: false })
export class MealsTime {
  @Prop({ type: String, enum: PRODUCT_MEALS_TIME, required: false })
  name: string;

  @Prop({ type: Time, required: false })
  times: Time;
}
