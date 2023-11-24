import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { z } from 'zod';

import { ERROR_CODES } from '../../../../libs/utils/src';

// export class ResendOtpClientDto {
//   @ApiProperty()
//   @IsString({ message: 'countryCode must be a string' })
//   countryCode: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
//   mobile: string;
// }

export const ResendOtpClientDto = z.object({
  countryCode: z.string(),
  mobile: z.string().regex(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers }),
});
