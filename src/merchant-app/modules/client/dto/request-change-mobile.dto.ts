import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class RequestChangeMobileRequestClientDto {
  @ApiProperty()
  @IsString()
  @MinLength(9)
  @MaxLength(10)
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsString()
  countryCode: string;
}
