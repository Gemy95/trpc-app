import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRatingScaleDto {
  @ApiProperty()
  @IsString()
  nameArabic: string;

  @ApiProperty()
  @IsString()
  nameEnglish: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNumber()
  level: number;
}
