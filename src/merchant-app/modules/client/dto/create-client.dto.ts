import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { Gender } from '../../common/constants/users.types';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class CreateClientDto {
  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  password: string;

  @ApiProperty()
  @IsString({ message: 'cityId must be a string' })
  @Validate(IsMongoObjectId)
  @IsOptional()
  cityId: string;

  @ApiProperty()
  @IsString({ message: 'countryId must be a string' })
  @Validate(IsMongoObjectId)
  countryId: string;

  @ApiProperty()
  @IsString()
  uuid: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  balance: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}
