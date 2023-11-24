import mongoose from 'mongoose';

export class Rating {
  rating: mongoose.Types.ObjectId;
  extraNote?: string;
  branch?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  merchant?: mongoose.Types.ObjectId;
  comment?: string;
}
