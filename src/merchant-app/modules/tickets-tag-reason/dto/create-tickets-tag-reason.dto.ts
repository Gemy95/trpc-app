import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateTicketsTagReasonDto {
  @ApiProperty()
  @IsString()
  descriptionArabic: string;

  @ApiProperty()
  @IsString()
  descriptionEnglish: string;
}
