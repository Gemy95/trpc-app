import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';

import { BANK_ACCOUNT_TYPE } from '../../common/constants/merchant';
import { Gender } from '../../common/constants/users.types';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class SocialMedia {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  visits?: number = 0;
}

export class BankAccount {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ each: true })
  bank: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nameOfPerson: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  iban: string;

  @ApiProperty({ enum: BANK_ACCOUNT_TYPE })
  @IsNotEmpty()
  @IsEnum(BANK_ACCOUNT_TYPE)
  accountType: BANK_ACCOUNT_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  accountImageUrl: string;
}

export class CreateMerchantDto {
  @ApiProperty()
  @IsString()
  @Length(1)
  nameArabic: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionArabic?: string;

  @ApiProperty()
  @IsString()
  @Length(1)
  nameEnglish: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionEnglish?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  commercialRegistrationNumber: string;

  @ApiProperty()
  @IsString()
  @Length(1)
  commercialName: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasDeliveryService?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  logo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  identificationImage?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  commercialIdImage?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  longitudeDelta?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitudeDelta?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  @Validate(IsMongoObjectId, { each: true })
  categoriesIds: string[];

  @ApiProperty({ type: [String] })
  @ArrayNotEmpty()
  @Validate(IsMongoObjectId, { each: true })
  tagsIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cityId: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  twitterUrl?: SocialMedia;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  facebookUrl?: SocialMedia;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  websiteUrl?: SocialMedia;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  snapUrl?: SocialMedia;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  tiktokUrl?: SocialMedia;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BankAccount)
  bankAccount?: BankAccount;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  menuTemplateId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lowestPriceToOrder?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimum_delivery_price?: number;
}
