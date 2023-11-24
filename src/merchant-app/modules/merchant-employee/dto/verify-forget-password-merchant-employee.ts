import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyForgetPasswordMerchantEmployeeDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Length(6)
  otp: string;
}
