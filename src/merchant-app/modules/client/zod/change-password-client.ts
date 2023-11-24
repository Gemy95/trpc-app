import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { z } from 'zod';

import ERROR_CODES from '../../../../libs/utils/src/lib/errors_codes';

// export class ChangePasswordClientDto {
//   @ApiProperty()
//   @IsEmail({}, { message: 'email must be a valid mail' })
//   email: string;

//   @ApiProperty()
//   @Length(8, 50, {
//     message: 'password must be at least 8 characters and max 50 characters',
//   })
//   password: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   oldPassword: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Length(6)
//   otp: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID('all')
//   uuid?: string;
// }

export const ChangePasswordClientDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
  oldPassword: z.string().min(8).max(50),
  otp: z.string().length(6),
  uuid: z.string().uuid().optional().nullish(),
});
