import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { z } from 'zod';

// export class BodyConfirmClientDto {
//   @ApiProperty()
//   @IsString()
//   @Length(6)
//   otp: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID('all')
//   uuid?: string;
// }

// export class ParamsConfirmClientDto {
//   @ApiProperty()
//   @IsEmail({}, { message: 'email must be valid email' })
//   email: string;
// }

export const ParamsConfirmClientDto = z.object({
  email: z.string().email(),
});

export const BodyConfirmClientDto = z
  .object({
    otp: z.string().length(6),
    uuid: z.string().uuid().optional().nullish(),
  })
  .merge(ParamsConfirmClientDto);
