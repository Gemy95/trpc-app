import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class ResetPasswordMerchantEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  tempPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  newPassword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;
}
