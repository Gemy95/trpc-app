import { forwardRef, Module } from '@nestjs/common';
import { MenuTemplateProductService } from './menu-template-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuTemplateProductResolver } from './menu-template-product.resolver';
import { SettingModule } from '../setting/setting.module';
import { ProductModule } from '../product/product.module';
import { MenuTemplateProduct, MenuTemplateProductSchema } from '../models';
import { MenuTemplateProductRepository } from '../models/menu-template-product/menu-template-product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MenuTemplateProduct.name, schema: MenuTemplateProductSchema }]),
    SettingModule,
    forwardRef(() => ProductModule),
  ],
  providers: [MenuTemplateProductService, MenuTemplateProductRepository, MenuTemplateProductResolver],
  exports: [MenuTemplateProductService, MenuTemplateProductRepository],
})
export class MenuTemplateProductModule {}
