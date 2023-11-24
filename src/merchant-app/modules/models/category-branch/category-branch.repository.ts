import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BranchCategory } from './category-branch.schema';

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
