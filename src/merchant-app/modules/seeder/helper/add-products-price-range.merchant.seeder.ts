import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Product } from '../../models';
import { Merchant } from '../../models';

@Injectable()
export class AddProductsPriceRangeMerchantSeeder implements Seeder {
  constructor(
    @InjectModel(Merchant.name) private readonly merchantnModel: Model<Merchant>,
    @InjectModel(Product.name) private readonly productnModel: Model<Product>,
  ) {}

  async seed(): Promise<any> {
    try {
      const merchants = await this.merchantnModel.find();

      for (let i = 0; i < merchants.length; i++) {
        let averageProductsPrice = (
          await this.productnModel
            .aggregate([
              { $match: { merchantId: merchants[i]._id } },
              { $group: { _id: null, average: { $avg: '$price' } } },
            ])
            .exec()
        )?.[0]?.average;

        await this.merchantnModel.updateOne(
          { _id: new mongoose.Types.ObjectId(merchants[i]._id) },
          {
            $set: {
              productsPriceRange: averageProductsPrice ? averageProductsPrice : 0,
            },
          },
        );
      }
    } catch (error) {
      console.log('error=', error);
    }
  }

  async drop(): Promise<any> {}
}
