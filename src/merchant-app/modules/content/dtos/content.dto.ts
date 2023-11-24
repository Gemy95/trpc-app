import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class TranslationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly _lang: string;
}

enum ContentType {
  MERCHANT_PRIVACY = 'MERCHANT_PRIVACY',
  OWNER_PRIVACY = 'OWNER_PRIVACY',
  CLIENT_PRIVACY = 'CLIENT_PRIVACY',
  CLIENT_TERMS = 'CLIENT_TERMS',
  MERCHANT_TERMS = 'MERCHANT_TERMS',
  OWNER_TERMS = 'OWNER_TERMS',
  CLIENT_FAQ = 'CLIENT_FAQ',
  MERCHANT_FAQ = 'MERCHANT_FAQ',
  OWNER_FAQ = 'OWNER_FAQ',
}

class QuestionAndAnswersDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  answer: string;
}

export class CreateContentDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ type: [TranslationDto] })
  @IsNotEmpty()
  translation: TranslationDto[];

  @ApiProperty({ type: String, enum: ContentType })
  @IsEnum(ContentType)
  content_type: ContentType;

  @ApiProperty({ type: [QuestionAndAnswersDto], default: [] })
  @IsOptional()
  faq: QuestionAndAnswersDto[];
}

export class QueryContentDto {
  @ApiProperty({ enum: ContentType })
  @IsString()
  @IsOptional()
  content_type?: ContentType;
}

export class UpdateContentDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ type: [TranslationDto] })
  @IsNotEmpty()
  translation: TranslationDto[];

  @ApiProperty({ type: [QuestionAndAnswersDto], default: [] })
  @IsOptional()
  faq: QuestionAndAnswersDto[];
}
