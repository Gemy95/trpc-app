import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class VerifyMobileOwnerDto {
  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  countryCode: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{6}$/, { message: ERROR_CODES.otp_must_be_longer_than_or_equal_to_6_characters })
  @Length(6)
  otp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;
}
