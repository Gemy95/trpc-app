import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;
}
