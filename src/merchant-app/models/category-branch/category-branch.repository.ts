import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BranchCategory } from '../../../libs/database/src/lib/models/category-branch/category-branch.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class BranchCategoryRepository extends BaseRepository<BranchCategory> {
  constructor(
    @InjectModel('BranchCategory')
    private readonly nModel: Model<BranchCategory>,
  ) {
    super(nModel);
  }

  async deleteOne(id: string): Promise<BranchCategory> {
    return this._model.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true });
  }
}
