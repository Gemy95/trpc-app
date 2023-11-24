import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { STATUS_ENUM } from '../city.constants';

class CityTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class CityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ type: String, default: 'inActive' })
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  client_status: string;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitudeDelta: number;

  @ApiProperty()
  @IsNumber()
  latitudeDelta: number;

  @ApiProperty({ type: String, default: 'inActive' })
  @IsNotEmpty()
  @IsIn(STATUS_ENUM)
  stores_status: string;

  @ApiProperty({ type: [CityTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => CityTranslationDto)
  readonly translation: CityTranslationDto[];
}

export class UpdateCityDto extends PartialType(CityDto) {}
