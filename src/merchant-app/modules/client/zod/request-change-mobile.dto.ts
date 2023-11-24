import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { z } from 'zod';

import { ERROR_CODES } from '../../../../libs/utils/src';

// export class RequestChangeMobileRequestClientDto {
//   @ApiProperty()
//   @IsString()
//   @MinLength(9)
//   @MaxLength(10)
//   @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
//   mobile: string;

//   @ApiProperty()
//   @IsString()
//   countryCode: string;
// }

export const RequestChangeMobileRequestClientDto = z.object({
  countryCode: z.string(),
  mobile: z.string().regex(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers }),
});
