import { Transform, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MERCHANT_STATUS } from '../../common/constants/merchant';
import { PRODUCT_CATEGORY_STATUS } from '../../product-category/dto/product-category.enum';

export class MenuFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PRODUCT_CATEGORY_STATUS)
  productCategoryStatus?: PRODUCT_CATEGORY_STATUS;

  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => String)
  productcategoriesIds?: string[];

  @IsOptional()
  @IsEnum(PRODUCT_CATEGORY_STATUS)
  productStatus?: PRODUCT_CATEGORY_STATUS;

  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => String)
  branchesIds?: string[];

  @IsOptional()
  @IsEnum(MERCHANT_STATUS)
  status?: MERCHANT_STATUS;
}
