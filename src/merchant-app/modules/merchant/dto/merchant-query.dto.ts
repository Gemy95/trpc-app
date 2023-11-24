import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MERCHANT_STATUS, MERCHANT_STATUS_TAGS, VISIBILITY_STATUS } from '../../common/constants/merchant';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class MerchantQueryDto extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  categories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  cities?: string[];

  @ApiPropertyOptional({ enum: MERCHANT_STATUS, required: false })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS)
  status?: string;

  @ApiPropertyOptional({ enum: MERCHANT_STATUS_TAGS, required: false })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS_TAGS)
  status_tags?: string;

  @ApiPropertyOptional({ enum: VISIBILITY_STATUS, required: false })
  @IsOptional()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerMobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerEmail?: string;
}
