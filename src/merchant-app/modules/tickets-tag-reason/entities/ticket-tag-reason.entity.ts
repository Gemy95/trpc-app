import mongoose from 'mongoose';

class Translation {
  _lang: string;
  description: string;
}

export class TagReason {
  description!: string;
  tag!: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  translation: Translation[];
}
