import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchCategoryDto } from './create-branch-category.dto';

export class UpdateBranchCategoryDto extends PartialType(CreateBranchCategoryDto) {}
