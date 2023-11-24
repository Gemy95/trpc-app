import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class OwnerFiltersQuery extends PartialType(BaseQuery) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @Transform(({ value }) => value.split(','))
  cities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}
