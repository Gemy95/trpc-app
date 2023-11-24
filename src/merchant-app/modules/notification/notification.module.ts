import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Merchant,
  MerchantRepository,
  MerchantSchema,
  Notification,
  NotificationRepository,
  NotificationSchema,
  User,
  UserRepository,
  UserSchema,
} from '../models';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { NotificationResolver } from './notification.resolver';
import { BranchModule } from '../branch/branch.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';

@Module({
  imports: [
    OneSignalModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: MerchantSchema },
    ]),
    forwardRef(() => MerchantEmployeeModule),
    forwardRef(() => BranchModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, UserRepository, MerchantRepository, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
