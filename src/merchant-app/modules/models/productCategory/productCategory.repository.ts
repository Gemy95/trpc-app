import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductCategoryDocument } from '../../../../libs/database/src/lib/models/productCategory/productCategory.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ProductCategoryRepository extends BaseRepository<ProductCategoryDocument> {
  constructor(
    @InjectModel('ProductCategory')
    private readonly nModel: Model<ProductCategoryDocument>,
  ) {
    super(nModel);
  }
}
