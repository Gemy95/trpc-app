import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PRODUCT_CATEGORY_STATUS } from './product-category.enum';

export class CreateProductCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameArabic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameEnglish: string;

  @ApiProperty({ enum: PRODUCT_CATEGORY_STATUS })
  @IsEnum(PRODUCT_CATEGORY_STATUS)
  status: string = PRODUCT_CATEGORY_STATUS.ACTIVE;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image: string;
}
