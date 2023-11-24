import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { DAYS } from '../../common/constants/branch.constants';
import { RESERVATION_STATUS } from '../../common/constants/reservation.constants';
import { GetAllDto } from '../../common/input/get-all.dto';

export class MerchantFindAllReservationDto extends PartialType(GetAllDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS, required: true })
  @IsNotEmpty()
  @IsEnum(DAYS)
  day: DAYS;

  @ApiPropertyOptional({ enum: RESERVATION_STATUS })
  @IsOptional()
  @IsEnum(RESERVATION_STATUS)
  status?: RESERVATION_STATUS;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientMobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  tablesIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVipTable?: boolean;
}
