import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class BodyConfirmMerchantEmployeeDto {
  @ApiProperty()
  @IsString()
  @Length(6)
  otp: string;
}

export class ParamsConfirmMerchantEmployeeDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be valid email' })
  email: string;
}
