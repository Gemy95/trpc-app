import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantModule } from '../merchant/merchant.module';
import { ProductCategory, ProductCategoryRepository, ProductCategorySchema } from '../models';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryResolver } from './product-category.resolver';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [
    forwardRef(() => MerchantModule),
    MongooseModule.forFeature([{ name: ProductCategory.name, schema: ProductCategorySchema }]),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository, ProductCategoryResolver],
  exports: [ProductCategoryRepository],
})
export class ProductCategoryModule {}
