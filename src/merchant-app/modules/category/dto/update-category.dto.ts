import { IsBoolean, IsIn, IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { CATEGORY_STATUS_ENUM } from '../category.constants';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
