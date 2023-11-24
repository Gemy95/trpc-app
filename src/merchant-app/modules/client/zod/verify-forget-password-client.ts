import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { z } from 'zod';

// export class VerifyForgetPasswordClientDto {
//   @ApiProperty()
//   @IsEmail({}, { message: 'email must be a valid mail' })
//   email: string;

//   @ApiProperty()
//   @IsString({ message: 'mobile must be a string' })
//   @Length(6)
//   otp: string;
// }

export const VerifyForgetPasswordClientDto = z.object({
  email: z.string().email({ message: 'email must be a valid mail' }),
  otp: z.string().length(6),
});
