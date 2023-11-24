import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Merchant } from '../../models';

@Injectable()
export class AddSocialUrlsMerchantSeeder implements Seeder {
  constructor(@InjectModel(Merchant.name) private readonly nModel: Model<Merchant>) {}

  async seed(): Promise<any> {
    try {
      const data = await this.nModel.updateMany(
        {},
        {
          $set: {
            twitterUrl: '',
            facebookUrl: '',
            websiteUrl: '',
            snapUrl: '',
            tiktokUrl: '',
            description: '',
            mobile: '',
            'translation.0.description': '',
          },
        },
        {},
      );
      console.log('data=', data);
    } catch (error) {
      console.log('error=', error);
    }
  }

  async drop(): Promise<any> {}
}
