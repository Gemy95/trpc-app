import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUS } from '../../common/constants/order.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class DriverOrderQueryDto extends OmitType(BaseQuery, ['search'] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderRefId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientMobile: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionRefId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderType: string;

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
  @IsEnum(ORDER_STATUS)
  status: string;
}
