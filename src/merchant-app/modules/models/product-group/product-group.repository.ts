import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductGroup } from '../../../../libs/database/src/lib/models/product-group/product-group.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ProductGroupRepository extends BaseRepository<ProductGroup> {
  constructor(
    @InjectModel('ProductGroup')
    private readonly nModel: Model<ProductGroup>,
  ) {
    super(nModel);
  }
}
