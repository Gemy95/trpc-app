import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { z } from 'zod';

import { ERROR_CODES } from '../../../../libs/utils/src';

// export class VerifyChangeMobileClientDto {
//   @ApiProperty()
//   @IsString({ message: 'countryCode must be a string' })
//   countryCode: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
//   mobile: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Length(6)
//   otp: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID('all')
//   uuid?: string;
// }

export const VerifyChangeMobileClientDto = z.object({
  countryCode: z.string(),
  mobile: z.string().regex(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers }),
  otp: z.string().length(6),
  uuid: z.string().uuid().optional().nullish(),
});
