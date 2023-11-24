import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { z } from 'zod';

// export class RequestChangeEmailClientDto {
//   @ApiProperty()
//   @IsEmail({}, { message: 'email must be a valid mail' })
//   email: string;
// }

export const RequestChangeEmailClientDto = z.object({
  email: z.string().email({ message: 'email must be a valid mail' }),
});
