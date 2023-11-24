import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { z } from 'zod';

import { ERROR_CODES } from '../../../../libs/utils/src';

// export class LoginClientDto {
//   @ApiProperty()
//   @IsString({ message: 'countryCode must be a string' })
//   countryCode: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
//   mobile: string;

//   @ApiProperty()
//   @Length(8, 50, {
//     message: 'password must be at least 8 characters and max 50 characters',
//   })
//   password: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID('all')
//   uuid?: string;
// }

export const LoginClientDto = z.object({
  countryCode: z.string(),
  mobile: z.string().regex(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers }),
  password: z.string().min(8).max(50),
  uuid: z.string().uuid().optional().nullish(),
});
