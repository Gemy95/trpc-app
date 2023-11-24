import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import {
  PRODUCT_APPROVED_STATUS,
  PRODUCT_PENDING_STATUS,
  PRODUCT_REJECTED_STATUS,
} from '../../common/constants/product';
import { Product } from '../../models';
import { ProductRepository } from '../../models/product/product.repository';

@Injectable()
export class AddInReviewProductSeeder implements Seeder {
  constructor(@InjectModel(Product.name) private readonly nModel: Model<Product>) {}

  async seed(): Promise<any> {
    try {
      const data = await this.nModel.updateMany(
        {
          $or: [
            {
              build_status: PRODUCT_PENDING_STATUS,
            },
            {
              build_status: PRODUCT_REJECTED_STATUS,
            },
          ],
        },
        { $set: { inReview: true } },
        {},
      );
      const data2 = await this.nModel.updateMany(
        { build_status: PRODUCT_APPROVED_STATUS },
        { $set: { inReview: false } },
        {},
      );

      console.log('data=', data);
    } catch (error) {
      console.log('error=', error);
    }
  }

  async drop(): Promise<any> {}
}
