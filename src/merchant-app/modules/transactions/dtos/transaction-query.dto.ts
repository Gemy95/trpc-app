import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { ORDER_STATUS } from '../../common/constants/order.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class TransactionQueryDto extends BaseQuery {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  merchantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderRefId?: string; // use it as string because pipeline $regex can working only on string

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @ApiPropertyOptional({ enum: ORDER_STATUS })
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  @IsString()
  orderStatus?: ORDER_STATUS;

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
}
