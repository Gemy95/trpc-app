import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProductGroup } from '../product-group/product-group.schema';
import { Product } from '../product/product.schema';

@Schema({})
class Option {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'GroupOption' })
  _id: string; // mongoose.Types.ObjectId;
}

@Schema({
  timestamps: false,
  _id: false,
})
class Groups {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'ProductGroup' })
  productGroupId: string; // ProductGroup | mongoose.Types.ObjectId;

  @Prop([Option])
  options: Option[];
}

@Schema()
export class Item {
  @Prop({ type: Number })
  count: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product' })
  productId: string; // Product | mongoose.Types.ObjectId;

  @Prop([Groups])
  groups: Groups[];
}
