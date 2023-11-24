import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const SUPPORTED_LANGUAGES = ['ar', 'en'];

export class Translation {
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  @ApiProperty()
  @IsNotEmpty()
  readonly _lang: string;
}
