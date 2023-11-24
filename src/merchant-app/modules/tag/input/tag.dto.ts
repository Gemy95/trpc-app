import { Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';

class TagTranslationDto extends Translation {
  // @Field()
  @IsString()
  readonly name: string;
}

export class TagDto {
  // @Field()
  @IsString()
  readonly name: string;

  // @Field()
  @IsBoolean()
  @IsOptional()
  new: boolean;

  // @Field()
  @IsBoolean()
  client_visibility: boolean;

  // @Field()
  @IsBoolean()
  stores_visibility: boolean;

  // @Field()
  @IsString()
  @IsUrl()
  image: string;

  // @Field()
  @ValidateNested({ each: true })
  @Type(() => TagTranslationDto)
  @Transform((param) => {
    return param.value;
  })
  readonly translation: [TagTranslationDto];
}

export class UpdateTagDto extends PartialType(TagDto) {}
