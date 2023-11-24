import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Merchant } from '../../models';
import { Product } from '../../models';

@Injectable()
export class AddProductsSerialDisplayNumberSeeder implements Seeder {
  constructor(
    @InjectModel(Merchant.name) private readonly merchantnModel: Model<Merchant>,
    @InjectModel(Product.name) private readonly productnModel: Model<Product>,
  ) {}

  async seed(): Promise<any> {
    try {
      let distinctMerchants = await this.productnModel
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
        let merchantProducts = await this.productnModel.find({
          merchantId: distinctMerchants[i],
        });

        for (let j = 0; j < merchantProducts.length; j++) {
          await this.productnModel.updateOne(
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
