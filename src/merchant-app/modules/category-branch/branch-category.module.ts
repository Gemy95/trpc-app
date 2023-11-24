import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchCategoryService } from './branch-category.service';
import { BranchCategoryController } from './branch-category.controller';
import { BranchCategorySchema, BranchCategory, BranchCategoryRepository } from '../models';

@Module({
  imports: [MongooseModule.forFeature([{ name: BranchCategory.name, schema: BranchCategorySchema }])],
  controllers: [BranchCategoryController],
  providers: [BranchCategoryService, BranchCategoryRepository],
})
export class BranchCategoryModule {}
