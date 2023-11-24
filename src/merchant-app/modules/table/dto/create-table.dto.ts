import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { DAYS } from '../../common/constants/branch.constants';
import { TABLE_LOCATION, TABLE_TYPE } from '../../common/constants/table.constants';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class TableImageDto {
  @ApiProperty({ type: String })
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  titleArabic?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  titleEnglish?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionArabic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEnglish?: string;
}

export class Duration {
  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  startAt: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  endAt: string;
}

export class WorkingHour {
  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS })
  @IsEnum(DAYS)
  day: DAYS;

  @ApiProperty({ type: [Duration] })
  @ValidateNested({ each: true })
  @Type(() => Duration)
  durations: Duration[];
}

export class CreateTableDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  number: string;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  floor: number;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  vip?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  extraPrice?: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  nameEnglish: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Length(1)
  nameArabic: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  descriptionEnglish?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  descriptionArabic?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsMongoObjectId)
  branchId: string;

  @ApiProperty({ type: [String], enum: TABLE_LOCATION })
  @IsOptional()
  @IsEnum(TABLE_LOCATION, { each: true })
  locationEnglish?: TABLE_LOCATION[];

  @ApiProperty({ type: [String], enum: TABLE_LOCATION })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(TABLE_LOCATION, { each: true })
  location: TABLE_LOCATION[];

  @ApiProperty({ default: TABLE_TYPE.TABLE, enum: TABLE_TYPE, required: false })
  @IsOptional()
  @IsEnum(TABLE_TYPE)
  type?: TABLE_TYPE;

  @ApiProperty({ type: [TableImageDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TableImageDto)
  images?: TableImageDto[];

  // @ApiPropertyOptional({ type: [WorkingHour] })
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => WorkingHour)
  // workingHours?: WorkingHour[];
}
