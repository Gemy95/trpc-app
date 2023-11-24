import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import { Setting } from '../../models';

@Injectable()
export class AddSettingSeeder implements Seeder {
  constructor(@InjectModel(Setting.name) private readonly nModel: Model<Setting>) {}

  async seed(): Promise<any> {
    try {
      const data = await this.nModel.create([
        {
          otp_verify_type: 'mobile',
          modelName: 'verification',
        },
        {
          minDistance: 0,
          maxDistance: 25000,
          modelName: 'Branch',
        },
        {
          modelName: 'BranchGroup',
          minDistance: 0,
          maxDistance: 1000,
        },
        {
          modelName: 'Order',
          TimeAfterDeliveredOrder: 3,
        },
        {
          minDistance: 0,
          maxDistance: 35000,
          modelName: 'MarketplaceMerchantBranches',
        },
        {
          modelName: 'ShoppexOrderTax',
          amount: 15,
          type: 'percentage',
        },
        {
          modelName: 'LowestMarketplaceOrderPrice',
          amount: 25,
          type: AMOUNT_TYPE.FIXED,
        },
        {
          modelName: 'MerchantLowestPriceToOrder',
          amount: 25,
          type: AMOUNT_TYPE.FIXED,
        },
      ]);

      console.log('data=', 'run.....');
    } catch (error) {
      console.log('error=', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async drop(): Promise<any> {}
}
