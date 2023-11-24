import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Merchant } from '../../models';
import { ProductCategory } from '../../models';

@Injectable()
export class AddProductsCategoriesSerialDisplayNumberSeeder implements Seeder {
  constructor(
    @InjectModel(Merchant.name) private readonly merchantnModel: Model<Merchant>,
    @InjectModel(ProductCategory.name)
    private readonly productcategorynModel: Model<ProductCategory>,
  ) {}

  async seed(): Promise<any> {
    try {
      let distinctMerchants = await this.productcategorynModel
        .aggregate([
          { $group: { _id: '$merchantId' } },
          {
            $match: {
              _id: {
                $exists: true,
                $ne: null,
              },
            },
          },
        ])
        .exec();

      for (let i = 0; i < distinctMerchants.length; i++) {
        let merchantProducts = await this.productcategorynModel.find({
          merchantId: distinctMerchants[i],
        });

        for (let j = 0; j < merchantProducts.length; j++) {
          await this.productcategorynModel.updateOne(
            { _id: merchantProducts[j]._id },
            { $set: { serialDisplayNumber: j + 1 } },
          );
        }
      }
    } catch (error) {
      console.log('error=', error);
    }
  }

  async drop(): Promise<any> {}
}
