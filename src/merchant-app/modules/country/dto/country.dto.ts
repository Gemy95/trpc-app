import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { STATUS, STATUS_ENUM } from '../country.constants';

class CountryTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class CountryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsIn(STATUS_ENUM)
  readonly client_status: string = STATUS.active;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsIn(STATUS_ENUM)
  readonly stores_status: string = STATUS.active;

  @ValidateNested({ each: true })
  @Type(() => CountryTranslationDto)
  @ApiProperty({ type: [CountryTranslationDto] })
  readonly translation: [CountryTranslationDto];
}
