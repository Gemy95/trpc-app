import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductCategoryDto } from '../../product-category/dto/product-category.dto';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class ProductCategoryAndProducts extends CreateProductCategoryDto {
  @ApiProperty({ type: [String] })
  @IsOptional()
  @Validate(IsMongoObjectId, { each: true })
  menuTemplateProductsIds?: string[];
}

export class CreateMenuTemplateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nameArabic: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nameEnglish: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ type: [ProductCategoryAndProducts] })
  @ValidateNested({ each: true })
  @Type(() => ProductCategoryAndProducts)
  productCategoryAndProducts: ProductCategoryAndProducts[];

  // @ApiProperty({ type: [CreateProductGroupMenuTemplateDto] })
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => CreateProductGroupMenuTemplateDto)
  // productGroups?: CreateProductGroupMenuTemplateDto[];
}
