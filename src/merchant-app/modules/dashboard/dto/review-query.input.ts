import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MERCHANT_REQUEST_TYPES } from '../../common/constants/merchant';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class ReviewQuery extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  models: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => String)
  cities: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(0, 0, 0, 0)))
  @IsDate()
  fromCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(23, 59, 59, 999)))
  @IsDate()
  toCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(MERCHANT_REQUEST_TYPES)
  merchantRequestType: MERCHANT_REQUEST_TYPES;
}
