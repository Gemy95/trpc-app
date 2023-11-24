import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { Gender } from '../../common/constants/users.types';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { EMPLOYEE_STATUS } from '../interface/status.enum';

export class PermissionValueDto {
  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateShoppexEmployeeDto {
  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  countryCode: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;

  @ApiProperty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  password: string;

  @ApiProperty()
  @IsString({ message: 'cityId must be a string' })
  cityId: string;

  @ApiProperty()
  @IsString({ message: 'countryId must be a string' })
  countryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid: string;

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  @Validate(IsMongoObjectId, { each: true })
  departments: string[];

  @ApiProperty({ enum: EMPLOYEE_STATUS })
  @IsEnum(EMPLOYEE_STATUS)
  @IsOptional()
  status: EMPLOYEE_STATUS;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnOrders?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnReservations?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnRatings?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnTransactions?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnRequests?: boolean;

  @ApiProperty({ type: [PermissionValueDto] })
  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionValueDto)
  permissions?: PermissionValueDto[];

  @ApiPropertyOptional({ default: 'developer' })
  @IsEnum(['developer'])
  @IsOptional()
  @IsString()
  job?: string;
}
