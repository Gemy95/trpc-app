import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Translation } from '../../common/input/Translation.dto';
import { Type } from 'class-transformer';
import { STATUS, STATUS_ENUM } from '../country.constants';
import { Field, InputType } from '@nestjs/graphql';

class CountryTranslationDto extends Translation {
  @Field()
  @IsString()
  readonly name: string;
}

export class CountryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  readonly client_status: string = STATUS.active;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  readonly stores_status: string = STATUS.active;

  // @Field()
  @ValidateNested({ each: true })
  @Type(() => CountryTranslationDto)
  readonly translation: [CountryTranslationDto];
}
