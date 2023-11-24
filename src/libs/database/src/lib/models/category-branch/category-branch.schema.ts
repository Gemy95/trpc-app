import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const { Types } = mongoose.Schema;

@Schema()
export class BranchImageCategory {
  @Prop({ trim: true, required: true })
  url: string;

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;
}

@Schema({ timestamps: true })
export class BranchCategory {
  @Prop({ trim: true, required: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop([BranchImageCategory])
  images: BranchImageCategory[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Branch' })
  branchId: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const BranchCategorySchema = SchemaFactory.createForClass(BranchCategory);
