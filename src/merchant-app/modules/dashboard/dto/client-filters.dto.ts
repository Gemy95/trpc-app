import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsMongoId, IsString, IsEmail, IsBoolean } from 'class-validator';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class ClientFiltersQuery extends PartialType(BaseQuery) {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsMongoId({ each: true })
  cities: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isDeleted = false;
}
