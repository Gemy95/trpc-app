import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ProductGroup } from '../../../libs/database/src/lib/models/product-group/product-group.schema';

@Injectable()
export class ProductGroupRepository extends BaseRepository<ProductGroup> {
  constructor(
    @InjectModel('ProductGroup')
    private readonly nModel: Model<ProductGroup>,
  ) {
    super(nModel);
  }
}
