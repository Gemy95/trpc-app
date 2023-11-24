import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';

export class CreateOwnerDto {
  @ApiProperty()
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'countryCode must be a string' })
  countryCode: string;

  @ApiProperty()
  @IsString({ message: 'mobile must be a string' })
  @Matches(/^\d+$/, { message: ERROR_CODES.must_use_only_english_numbers })
  mobile: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be a valid mail' })
  email: string;

  @ApiProperty()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  password: string;

  @ApiProperty()
  @IsString({ message: 'cityId must be a string' })
  cityId: string;

  @ApiProperty()
  @IsString({ message: 'countryId must be a string' })
  countryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;
}
