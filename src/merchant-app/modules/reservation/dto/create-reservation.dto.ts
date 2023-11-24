import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { DAYS } from '../../common/constants/branch.constants';
import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { RESERVATION_PLATFORM } from '../../common/constants/reservation.constants';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { Item } from '../../order/dto/create-order.dto';

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsMongoObjectId)
  merchant: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsMongoObjectId)
  branch: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ArrayNotEmpty()
  @IsString({ each: true })
  clientDetails?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeNotes?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfGuests: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  numberOfAdultsGuests: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  numberOfChildrenGuests: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS, required: true })
  @IsNotEmpty()
  @IsEnum(DAYS)
  day: DAYS;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  timeFrom: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  timeTo: string;

  @ApiProperty({ enum: PAYMENT_TYPES })
  @IsNotEmpty()
  @IsEnum(PAYMENT_TYPES)
  paymentType: string;

  // @ApiProperty()
  // @IsObject()
  // payment: any;

  // @ApiProperty({ type: [Item] })
  // @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => Item)
  // items: Item[];

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  @Validate(IsMongoObjectId, { each: true })
  tablesIds: string[];

  @ApiProperty({
    example: RESERVATION_PLATFORM.WEB,
    enum: RESERVATION_PLATFORM,
  })
  @IsEnum(RESERVATION_PLATFORM)
  platform?: RESERVATION_PLATFORM;
}
