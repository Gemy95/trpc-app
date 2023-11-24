import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Translation } from '../../common/input/Translation.dto';
import { Type } from 'class-transformer';
import { STATUS_ENUM } from '../city.constants';
import { Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';

class CityTranslationDto extends Translation {
  // @Field()
  @IsString()
  readonly name: string;
}

export class CityDto {
  // @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  // @Field()
  @IsMongoId()
  @IsNotEmpty()
  country: string;

  // @Field()
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  client_status: string;

  // @Field()
  @IsNumber()
  longitude: number;

  // @Field()
  @IsNumber()
  latitude: number;

  // @Field()
  @IsNumber()
  longitudeDelta: number;

  // @Field()
  @IsNumber()
  latitudeDelta: number;

  // @Field()
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  stores_status: string;

  // @Field()
  @ValidateNested({ each: true })
  @Type(() => CityTranslationDto)
  readonly translation: CityTranslationDto[];

  // @Field()
  @IsOptional()
  @IsBoolean()
  isEnabledReservation: boolean;
}

export class UpdateCityDto extends PartialType(CityDto) {}
