import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StorageService } from '../../storage.service';
import { TrpcModule } from '../../trpc/trpc.module';
import { ConfigurationService } from '../config/configuration.service';
import { Category, CategoryRepository, CategorySchema } from '../models';
import { CategoryController } from './category.controller';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { MarketPlaceCategoryController } from './marketplace-category.controller';
import { MarketPlaceCategoryResolver } from './marketplace-category.resolver';
import { MarketPlaceCategoryRouter } from './marketplace-category.router';
import { MarketPlaceCategoryService } from './marketplace-category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), forwardRef(() => TrpcModule)],
  controllers: [CategoryController, MarketPlaceCategoryController],
  providers: [
    CategoryService,
    StorageService,
    ConfigurationService,
    CategoryRepository,
    MarketPlaceCategoryService,
    CategoryResolver,
    MarketPlaceCategoryResolver,
    MarketPlaceCategoryRouter,
  ],
  exports: [CategoryRepository, CategoryService, MarketPlaceCategoryRouter],
})
export class CategoryModule {}
