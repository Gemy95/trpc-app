import { Module } from '@nestjs/common';
import { MenuTemplateService } from './menu-template.service';
import { MenuTemplate, MenuTemplateRepository, MenuTemplateSchema } from '../models';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuTemplateResolver } from './menu-template.resolver';
import { SettingModule } from '../setting/setting.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MenuTemplate.name, schema: MenuTemplateSchema }]),
    SettingModule,
    ProductModule,
  ],
  providers: [MenuTemplateService, MenuTemplateRepository, MenuTemplateResolver],
  exports: [MenuTemplateService, MenuTemplateRepository],
})
export class MenuTemplateModule {}
