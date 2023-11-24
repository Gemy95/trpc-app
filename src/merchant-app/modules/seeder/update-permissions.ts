import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import {
  ADMIN_ROLE,
  DRIVER_ROLE,
  MERCHANT_EMPLOYEE_ROLE,
  OWNER_ROLE,
  PROVIDER_EMPLOYEE_ROLE,
  PROVIDER_OWNER_ROLE,
  SHOPPEX_EMPLOYEE_ROLE,
} from '../../../libs/database/src/lib/common/roles';
import { User } from '../../../libs/database/src/lib/models/common/user.schema';
import { Driver } from '../../../libs/database/src/lib/models/driver/driver.schema';

@Injectable()
export class UpdatePermissionSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
  ) {}

  async seed(): Promise<any> {
    try {
      await this.userModel.updateMany(
        {
          type: 'Admin',
        },
        {
          $set: {
            role: ADMIN_ROLE,
          },
        },
        {},
      );

      await this.userModel.updateMany(
        {
          type: 'ShoppexEmployee',
        },
        {
          $set: {
            role: SHOPPEX_EMPLOYEE_ROLE,
          },
        },
        {},
      );

      await this.userModel.updateMany(
        {
          type: 'Owner',
        },
        {
          $set: {
            role: OWNER_ROLE,
          },
        },
        {},
      );

      await this.userModel.updateMany(
        {
          type: 'MerchantEmployee',
        },
        {
          $set: {
            role: MERCHANT_EMPLOYEE_ROLE,
          },
        },
        {},
      );

      await this.userModel.updateMany(
        {
          type: 'ProviderOwner',
        },
        {
          $set: {
            role: PROVIDER_OWNER_ROLE,
          },
        },
        {},
      );

      await this.userModel.updateMany(
        {
          type: 'ProviderEmployee',
        },
        {
          $set: {
            role: PROVIDER_EMPLOYEE_ROLE,
          },
        },
        {},
      );

      await this.driverModel.updateMany(
        {},
        {
          $set: {
            role: DRIVER_ROLE,
          },
        },
        {},
      );

      console.log('data=', 'run.....');
    } catch (error) {
      console.log('error=', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async drop(): Promise<any> {}
}
