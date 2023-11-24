import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from '../../../libs/database/src/lib/models/order/order.schema';
import { ClientModule } from '../client/client.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import {
  Branch,
  BranchRepository,
  BranchSchema,
  Coupon,
  CouponRepository,
  CouponSchema,
  OrderRepository,
} from '../models';
import { SettingModule } from '../setting/setting.module';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    SettingModule,
    ClientModule,
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    forwardRef(() => MerchantEmployeeModule),
  ],
  providers: [CouponService, CouponRepository, CouponResolver, BranchRepository, OrderRepository],
  exports: [CouponService, CouponRepository],
})
export class CouponModule {}
