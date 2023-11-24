import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import {
  MERCHANT_STATUS,
  MERCHANT_STATUS_TAGS,
  ONLINE_STATUS,
  VISIBILITY_STATUS,
} from '../../common/constants/merchant';
import { AMOUNT_TYPE, ORDER_TYPE } from '../../common/constants/order.constants';
import { CreateMerchantDto } from './create-merchant.dto';
import { Type } from 'class-transformer';

export class MerchantCommissionsDto {
  @ApiProperty({ type: Number, default: 0, required: true })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ default: ORDER_TYPE.ORDER_OFFLINE, enum: ORDER_TYPE, required: true })
  @IsNotEmpty()
  @IsEnum(ORDER_TYPE)
  orderType: ORDER_TYPE;

  @ApiProperty({ default: AMOUNT_TYPE.PERCENTAGE, enum: AMOUNT_TYPE, required: true })
  @IsNotEmpty()
  @IsEnum(AMOUNT_TYPE)
  type: AMOUNT_TYPE;
}

export class UpdateMerchantByShoppexEmployeeDto extends PartialType(CreateMerchantDto) {
  @ApiProperty({ default: MERCHANT_STATUS.APPROVED_STATUS, enum: MERCHANT_STATUS, required: false })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS)
  status: MERCHANT_STATUS;

  @ApiProperty({ default: MERCHANT_STATUS_TAGS, enum: MERCHANT_STATUS_TAGS, required: false })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS_TAGS)
  status_tags: MERCHANT_STATUS_TAGS;

  @ApiProperty({ default: ONLINE_STATUS, enum: VISIBILITY_STATUS, required: false })
  @IsOptional()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status: VISIBILITY_STATUS;

  @ApiProperty({ type: [MerchantCommissionsDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MerchantCommissionsDto)
  commissions?: [MerchantCommissionsDto];
}
