import { Prop, Schema } from '@nestjs/mongoose';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';

@Schema({
  timestamps: false,
  _id: false,
})
class TranslationOption {
  @Prop({ trim: true })
  _lang: string;

  @Prop({ trim: true })
  name: string;
}

@Schema({
  timestamps: false,
  _id: false,
})
export class ChargeDetails {
  @Prop({ trim: true })
  name?: string;

  @Prop()
  is_active?: boolean;

  @Prop({
    type: String,
    enum: AMOUNT_TYPE,
    default: AMOUNT_TYPE.PERCENTAGE,
    required: false,
  })
  type: string;

  @Prop()
  amount: number;

  @Prop([TranslationOption])
  translation?: TranslationOption[];
}

@Schema({
  timestamps: false,
  _id: false,
})
export class Invoice {
  @Prop([ChargeDetails])
  charges: ChargeDetails[];

  @Prop({ type: Number })
  total: number;
}
