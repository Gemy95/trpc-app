import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
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
import { MERCHANT_EMPLOYEE_JOB } from '../../common/constants/merchant-employee';
import { Gender, OTP_VERIFICATION_TYPE } from '../../common/constants/users.types';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class PermissionValueDto {
  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateMerchantEmployeeDto {
  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  countryCode: string;

  @ApiPropertyOptional()
  @IsString({ message: 'merchantId must be a string' })
  @IsOptional()
  merchantId: string;

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
  @IsOptional()
  @IsString({ message: 'cityId must be a string' })
  cityId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'countryId must be a string' })
  countryId?: string;

  @ApiPropertyOptional()
  @IsUUID('all')
  @IsOptional()
  uuid: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MERCHANT_EMPLOYEE_JOB)
  @IsOptional()
  job?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Validate(IsMongoObjectId, { each: true })
  branchesIds?: string[];

  @ApiPropertyOptional({ enum: OTP_VERIFICATION_TYPE })
  @IsOptional()
  @IsEnum(OTP_VERIFICATION_TYPE)
  otp_verify_type?: OTP_VERIFICATION_TYPE;

  @ApiPropertyOptional({ type: [PermissionValueDto] })
  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionValueDto)
  permissions?: PermissionValueDto[];
}

export class CreateMerchantEmployeesDto {
  @ApiProperty({ type: [CreateMerchantEmployeeDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateMerchantEmployeeDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  merchantEmployees: CreateMerchantEmployeeDto[];
}
