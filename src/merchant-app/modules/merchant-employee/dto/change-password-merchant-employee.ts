import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ChangePasswordMerchantEmployeeDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;

  @ApiProperty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  password: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Length(6)
  otp: string;
}
