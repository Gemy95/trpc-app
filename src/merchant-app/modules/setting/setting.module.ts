import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Setting, SettingSchema } from '../../../libs/database/src/lib/models/setting/setting.schema';
import { SettingRepository } from '../models/setting/setting.repository';
import { MarketplaceSettingController } from './marketplace-setting.controller';
import { MarketplaceSettingResolver } from './marketplace-setting.resolver';
import { MarketplaceSettingService } from './marketplace-setting.service';
import { SettingController } from './setting.controller';
import { SettingResolver } from './setting.resolver';
import { SettingService } from './setting.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
  controllers: [SettingController, MarketplaceSettingController],
  providers: [
    SettingService,
    MarketplaceSettingService,
    SettingRepository,
    SettingResolver,
    MarketplaceSettingResolver,
  ],
  exports: [SettingRepository, SettingService],
})
export class SettingModule {}
