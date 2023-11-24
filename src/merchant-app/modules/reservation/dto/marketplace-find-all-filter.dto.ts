import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { RESERVATION_STATUS } from '../../common/constants/reservation.constants';
import { BaseQuery } from '../../common/input/BaseQuery.dto';
import { GetAllDto } from '../../common/input/get-all.dto';

export class MarketPlaceFindAllReservationDto extends PartialType(BaseQuery) {
  @ApiPropertyOptional({ enum: RESERVATION_STATUS })
  @IsOptional()
  @IsEnum(RESERVATION_STATUS)
  status?: RESERVATION_STATUS;
}
