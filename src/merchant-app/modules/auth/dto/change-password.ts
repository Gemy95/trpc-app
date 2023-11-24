import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 50)
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 50)
  newPassword: string;
}
