import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class GetAllNearestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @IsMongoId({ each: true })
  categoriesIds: string[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clientId?: string;
}

export class GetAllNearestFilterObject {
  @ApiProperty()
  @IsString()
  @IsOptional()
  sortByPrice?: 'desc' | 'asc';

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  productCategoriesNames?: string[];

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  maxDistance?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  minDistance?: number;

  @ApiProperty({ default: '$' })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty()
  @IsOptional()
  @Min(3)
  @Max(5)
  @IsNumber()
  rate?: number;
}
