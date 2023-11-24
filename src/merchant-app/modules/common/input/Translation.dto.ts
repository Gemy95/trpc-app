import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Field } from '@nestjs/graphql';

const SUPPORTED_LANGUAGES = ['ar', 'en'];

export class Translation {
  @Field()
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  @IsNotEmpty()
  readonly _lang: string;
}
