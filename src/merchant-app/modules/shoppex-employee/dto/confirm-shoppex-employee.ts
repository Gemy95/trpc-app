import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class BodyConfirmShoppexEmployeeDto {
  @ApiProperty()
  @IsString()
  @Length(6)
  otp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;
}

export class ParamsConfirmShoppexEmployeeDto {
  @ApiProperty()
  @IsEmail({}, { message: 'email must be valid email' })
  email: string;
}
