import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

import { CreateMerchantEmployeeDto } from './create-merchant-employee.dto';

export class UpdateMerchantEmployeeByItselfDto extends PartialType(
  OmitType(CreateMerchantEmployeeDto, [
    'email',
    'mobile',
    'countryCode',
    'password',
    'uuid',
    'countryId',
    'branchesIds',
    'merchantId',
    'otp_verify_type',
  ] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  oldPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  newPassword?: string;
}
