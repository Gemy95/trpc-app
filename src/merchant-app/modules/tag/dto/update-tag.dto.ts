import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { STATUS_ENUM } from '../tag.constants';
import { Translation } from '../../common/dto/Translation.dto';

class TagTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class UpdateTagDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  client_visibility: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  stores_visibility: boolean;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // @IsIn(STATUS_ENUM)
  // status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ type: [TagTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TagTranslationDto)
  @Transform((param) => {
    return param.value;
  })
  readonly translation: [TagTranslationDto];
}
