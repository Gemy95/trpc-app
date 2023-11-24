import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { MERCHANT_STATUS, MERCHANT_STATUS_TAGS } from '../../common/constants/merchant';
import { AMOUNT_TYPE, ORDER_TYPE } from '../../common/constants/order.constants';

export class MerchantCommissionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ORDER_TYPE })
  @IsOptional()
  @IsEnum(ORDER_TYPE)
  orderType: string;

  @ApiProperty({ enum: AMOUNT_TYPE })
  @IsOptional()
  @IsEnum(AMOUNT_TYPE)
  type: string;
}

export class MerchantApproveOrRejectDto {
  @ApiProperty({ enum: MERCHANT_STATUS })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS)
  status: string;

  @ApiProperty({ enum: MERCHANT_STATUS_TAGS })
  @IsOptional()
  @IsEnum(MERCHANT_STATUS_TAGS)
  status_tags: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  notes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MerchantCommissionDto)
  commissions?: MerchantCommissionDto[];
}
