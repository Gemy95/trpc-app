import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Product } from '../../models';
import { ProductRepository } from '../../models/product/product.repository';

@Injectable()
export class AddNumberOfSaleIntoProductSeeder implements Seeder {
  constructor(@InjectModel(Product.name) private readonly nModel: Model<Product>) {}

  async seed(): Promise<any> {
    try {
      const data = await this.nModel.updateMany({}, { $set: { numberOfSale: 10 } }, {});
      console.log('data=', data);
    } catch (error) {
      console.log('error=', error);
    }
  }

  async drop(): Promise<any> {}
}
