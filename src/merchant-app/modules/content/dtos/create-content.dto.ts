import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { ContentType } from '../../models';
import { STATUS } from '../../common/constants/status.constants';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

class ContentTranslationDto extends Translation {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly text: string;
}

export class PrivacyDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ContentTranslationDto)
  @ApiProperty({ type: [ContentTranslationDto] })
  readonly translation: [ContentTranslationDto];
}

export class TermsAndConditionsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ type: [ContentTranslationDto] })
  @ValidateNested({ each: true })
  @Type(() => ContentTranslationDto)
  readonly translation: [ContentTranslationDto];
}

export class LandingPageDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  image: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description: string;
}

export class QuestionAndAnswersDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  answer: string[];
}

export class FAQ {
  @ApiProperty({ type: [QuestionAndAnswersDto] })
  @ValidateNested({ each: true })
  @Type(() => QuestionAndAnswersDto)
  readonly questionAndAnswers: [QuestionAndAnswersDto];
}

export class CreateContentDto {
  @ApiProperty({ type: [PrivacyDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PrivacyDto)
  privacy?: PrivacyDto[];

  @ApiProperty({ type: [TermsAndConditionsDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermsAndConditionsDto)
  termsAndConditions?: TermsAndConditionsDto[];

  @ApiProperty({ type: [LandingPageDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LandingPageDto)
  landingPage?: LandingPageDto[];

  @ApiProperty({ type: [FAQ] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FAQ)
  faq?: FAQ[];

  // @ApiProperty({ enum: ContentType, example: ContentType.CLIENT, default: ContentType.CLIENT })
  @IsEnum(ContentType)
  contentType: ContentType;
}
