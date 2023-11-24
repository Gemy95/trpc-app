import { IsBoolean, IsIn, IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { CATEGORY_STATUS_ENUM } from '../category.constants';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

class CategoryTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(CATEGORY_STATUS_ENUM)
  @ApiProperty()
  readonly status: string;

  @IsBoolean()
  @ApiProperty()
  client_visibility: boolean;

  @IsBoolean()
  @ApiProperty()
  stores_visibility: boolean;

  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  @ApiProperty({ type: [CategoryTranslationDto] })
  readonly translation: [CategoryTranslationDto];

  @ApiProperty()
  @IsString()
  @IsUrl()
  image: string;
}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
