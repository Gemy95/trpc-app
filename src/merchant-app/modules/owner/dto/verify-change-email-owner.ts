import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class VerifyChangeEmailOwnerDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Matches(/^\d{6}$/, { message: ERROR_CODES.otp_must_be_longer_than_or_equal_to_6_characters })
  @Length(6)
  otp: string;
}
