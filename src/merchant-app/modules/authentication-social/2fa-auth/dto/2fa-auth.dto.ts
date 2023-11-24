import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TFADto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'code must be a string' })
  code: string;
}
