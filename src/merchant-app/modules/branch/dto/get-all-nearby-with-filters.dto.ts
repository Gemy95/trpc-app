import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetAllNearByDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  categoriesIds: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  tagsIds: string[];

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ obj }) => parseInt(obj.price))
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clientId?: string;
}

export class GetAllNearByFilterObject extends GetAllNearByDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortByPrice?: 'desc' | 'asc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  productCategoriesNames?: string[];

  @ApiPropertyOptional({ type: Number, default: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxDistance?: number = 25000;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minDistance?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => (obj.fastest.toLowerCase() === 'true' ? true : false))
  @IsBoolean()
  fastest: true;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => (obj.trending.toLowerCase() === 'true' ? true : false))
  @IsBoolean()
  trending: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => (obj.nearest.toLowerCase() === 'true' ? true : false))
  @IsBoolean()
  nearest: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(3)
  @Max(5)
  @IsNumber()
  rate?: number;
}
