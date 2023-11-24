import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import {
  MERCHANT_STATUS,
  MERCHANT_STATUS_TAGS,
  ONLINE_STATUS,
  VISIBILITY_STATUS,
} from '../../common/constants/merchant';
import { CreateMerchantDto } from '../../merchant/dto/create-merchant.dto';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
  // @ApiProperty({ default: MERCHANT_STATUS, enum: MERCHANT_STATUS, required: false })
  // @IsOptional()
  // @IsEnum(MERCHANT_STATUS)
  // status?: MERCHANT_STATUS;

  // @ApiProperty({ default: MERCHANT_STATUS_TAGS, enum: MERCHANT_STATUS_TAGS, required: false })
  // @IsOptional()
  // @IsEnum(MERCHANT_STATUS_TAGS)
  // status_tags?: MERCHANT_STATUS_TAGS;

  @ApiProperty({ default: ONLINE_STATUS, enum: VISIBILITY_STATUS, required: false })
  @IsOptional()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status?: VISIBILITY_STATUS;
}
