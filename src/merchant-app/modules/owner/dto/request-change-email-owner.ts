import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestChangeEmailOwnerDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;
}
