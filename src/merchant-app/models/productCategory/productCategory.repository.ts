import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ProductCategoryDocument } from '../../../libs/database/src/lib/models/productCategory/productCategory.schema';

@Injectable()
export class ProductCategoryRepository extends BaseRepository<ProductCategoryDocument> {
  constructor(
    @InjectModel('ProductCategory')
    private readonly nModel: Model<ProductCategoryDocument>,
  ) {
    super(nModel);
  }
}
