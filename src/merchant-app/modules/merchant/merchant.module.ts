import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OneSignalModule } from '../onesignal/onesignal.module';
import {
  User,
  UserSchema,
  Client,
  ClientRepository,
  ClientSchema,
  Merchant,
  MerchantRepository,
  MerchantSchema,
} from '../models';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { MarketplaceMerchantController } from './marketplace-merchant.controller';
import { MarketplaceMerchantService } from './marketplace-merchant.service';
import { RequestsModule } from '../requests/requests.module';
import { MailModule } from '../mail/mail.module';
import { MerchantResolver } from './merchant.resolver';
import { DashboardMerchantResolver } from './dashboard-merchant.resolver';
import { DashboardMerchantService } from './dashboard-merchant.service';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    forwardRef(() => RequestsModule),
    MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }]),
    MailModule,
    OneSignalModule,
    ClientModule,
  ],
  controllers: [MerchantController, MarketplaceMerchantController],
  providers: [
    MerchantService,
    MerchantRepository,
    MarketplaceMerchantService,
    MerchantResolver,
    DashboardMerchantResolver,
    DashboardMerchantService,
  ],
  exports: [MerchantRepository],
})
export class MerchantModule {}
