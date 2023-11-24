import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { ORDER_TYPE } from '../../common/constants/order.constants';

export class EstimateStoreOrderFeesDto {
  @ApiProperty()
  @IsNotEmpty()
  // @IsMongoId()
  @IsString()
  branchId: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsMongoId()
  @IsString()
  merchantId: string;

  @ApiProperty({ example: ORDER_TYPE.ORDER_DINING, enum: ORDER_TYPE })
  @IsNotEmpty()
  @IsEnum(ORDER_TYPE)
  orderType: string;

  @ApiProperty({ example: PAYMENT_TYPES.PAYMENT_CASH_TYPE, enum: PAYMENT_TYPES })
  @IsNotEmpty()
  @IsEnum(PAYMENT_TYPES)
  paymentType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  coupons?: string[];
}
