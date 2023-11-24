import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class RequestCancelDeleteAccountOwnerDto {
  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  countryCode: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;
}
