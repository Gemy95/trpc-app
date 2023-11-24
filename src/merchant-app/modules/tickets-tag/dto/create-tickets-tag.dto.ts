import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTicketsTagDto {
  @ApiProperty()
  @IsString()
  descriptionArabic: string;

  @ApiProperty()
  @IsString()
  descriptionEnglish: string;
}
