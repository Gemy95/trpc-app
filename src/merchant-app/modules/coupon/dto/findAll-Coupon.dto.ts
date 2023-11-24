import { PartialType } from '@nestjs/mapped-types';
import { GetAllDto } from '../../common/input/get-all.dto';
import { IsBoolean, IsDate, IsEnum, IsMongoId, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { COUPON_STATUS } from '../../common/constants/coupon.constants';
import { Type } from 'class-transformer';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { ORDER_TYPE } from '../../common/constants/order.constants';
export class FindAllCouponsDto extends PartialType(GetAllDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @Validate(IsMongoObjectId, { each: true })
  branchesIds?: string[];

  @ApiProperty({ type: [String] })
  @IsOptional()
  @Validate(IsMongoObjectId, { each: true })
  productsIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expired_at?: Date;

  @ApiPropertyOptional({ default: COUPON_STATUS.Active })
  @IsOptional()
  @IsEnum(COUPON_STATUS)
  status?: COUPON_STATUS;

  @ApiPropertyOptional({ default: ORDER_TYPE.ORDER_BOOK })
  @IsOptional()
  @IsEnum(ORDER_TYPE)
  orderType?: ORDER_TYPE;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  free_delivery?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_new_client?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_reusable?: boolean;
}
