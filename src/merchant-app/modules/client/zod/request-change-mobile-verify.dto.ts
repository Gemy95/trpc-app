import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestChangeMobileRequestClientDto } from './request-change-mobile.dto';
import { z } from 'zod';

// export class RequestChangeMobileVerifyDto extends RequestChangeMobileRequestClientDto {
//   @ApiProperty()
//   @IsString()
//   @MinLength(6)
//   otp: string;
// }

export const RequestChangeMobileVerifyDto = z.object({
  otp: z.string().min(6),
});
