import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  ValidateNested,
} from 'class-validator';
import { property } from 'lodash';
import { PRODUCT_MEALS_TIME } from '../../common/constants/product';
import { STATUS } from '../../common/constants/status.constants';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class ProductGroupsOptionsOrders {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  serialDisplayNumber: number;
}

export class ProductGroupsOrders {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  serialDisplayNumber?: number;

  @ApiProperty({ type: [ProductGroupsOptionsOrders] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductGroupsOptionsOrders)
  options?: ProductGroupsOptionsOrders[];
}

export class ProductImageDto {
  @ApiProperty({ type: String })
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  titleArabic?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  titleEnglish?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionArabic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEnglish?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  new?: boolean;
}

export class CreateMenuTemplateProductDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nameArabic: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  nameEnglish: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  descriptionArabic: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  descriptionEnglish: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  preparationTime: number;

  @ApiProperty({ type: [ProductImageDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiProperty({ type: ProductImageDto })
  @IsOptional()
  @Type(() => ProductImageDto)
  mainImage?: ProductImageDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  price: number;

  @ApiProperty({ enum: STATUS, example: STATUS.ACTIVE })
  @IsEnum(STATUS)
  status: STATUS;

  @ApiProperty({ type: Number })
  @IsNumber()
  calories: number;

  @ApiProperty({
    description: 'List of meals time',
    isArray: true,
    enum: PRODUCT_MEALS_TIME,
  })
  @IsOptional()
  @IsEnum(PRODUCT_MEALS_TIME, { each: true })
  mealsTime?: PRODUCT_MEALS_TIME[];

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  quantity = 100;

  @ApiProperty({ type: [String] })
  @IsOptional()
  tagsIds?: string[];

  @ApiProperty({ type: [String] })
  @IsOptional()
  @Validate(IsMongoObjectId, { each: true })
  menuTemplateProductGroupsIds?: string[];
}
