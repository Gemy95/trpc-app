import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class UpdateClientDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'cityId must be a string' })
  @Validate(IsMongoObjectId)
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'countryId must be a string' })
  @Validate(IsMongoObjectId)
  countryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
