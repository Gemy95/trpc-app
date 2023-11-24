import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductGroupService } from './product-group.service';
import { ProductGroupController } from './product-group.controller';
import { ProductGroup, ProductGroupSchema, ProductGroupRepository } from '../models';
import { ProductGroupResolver } from './product-group.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductGroup.name, schema: ProductGroupSchema }])],
  controllers: [ProductGroupController],
  providers: [ProductGroupService, ProductGroupRepository, ProductGroupResolver],
  exports: [ProductGroupRepository],
})
export class ProductGroupModule {}
