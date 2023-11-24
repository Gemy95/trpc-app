import {
  ArrayNotEmpty,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { COUPON_STATUS } from '../../common/constants/coupon.constants';
import { AMOUNT_TYPE, ORDER_TYPE } from '../../common/constants/order.constants';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { Type } from 'class-transformer';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  merchantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  branchId: string;

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  @Validate(IsMongoObjectId, { each: true })
  productsIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  valid_from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expired_at: Date;

  @ApiPropertyOptional({ default: COUPON_STATUS.Active })
  @IsOptional()
  @IsEnum(COUPON_STATUS)
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  // Rules

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  total_max_use: number;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  max_use_per_client: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  discount_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AMOUNT_TYPE)
  discount_type?: AMOUNT_TYPE;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  free_delivery?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_new_client?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  client_orders_count_more_than?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ORDER_TYPE)
  orderType: ORDER_TYPE;

  // @ApiProperty({ type: [String] })
  // @ArrayNotEmpty()
  // @Validate(IsMongoObjectId, { each: true })
  // branchesIds: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  max_discount_amount: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  lowest_cart_price: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  is_reusable?: boolean;
}
