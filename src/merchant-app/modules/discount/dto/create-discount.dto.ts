import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber } from 'class-validator';
import { DiscountTypes } from '../../common/constants/discount.constants';

export class CreateDiscountDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsEnum(DiscountTypes)
  type: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @Transform(({ value }) => new Date(new Date(value).setHours(23, 59, 59, 999)).toISOString())
  endDate: Date;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsMongoId({ each: true })
  @Type(() => String)
  products: string[];
}
