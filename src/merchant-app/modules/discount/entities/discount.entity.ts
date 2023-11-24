import mongoose from 'mongoose';

export class Discount {
  _id?: string | mongoose.Types.ObjectId;

  amount: number;

  type: string;

  startDate: Date;

  endDate: Date;

  isActive: boolean;
}
