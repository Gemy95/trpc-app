import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';

class TagTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class TagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  new: boolean;

  @IsBoolean()
  @ApiProperty()
  client_visibility: boolean;

  @IsBoolean()
  @ApiProperty()
  stores_visibility: boolean;

  @ApiProperty()
  @IsString()
  @IsUrl()
  image: string;

  @ValidateNested({ each: true })
  @Type(() => TagTranslationDto)
  @ApiProperty({ type: [TagTranslationDto] })
  @Transform((param) => {
    return param.value;
  })
  readonly translation: [TagTranslationDto];
}

export class UpdateTagDto extends PartialType(TagDto) {}
