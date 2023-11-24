import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class CategoryQueryDto extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  client_visibility: boolean = undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  stores_visibility: boolean = undefined;
}

export class CategoryQueryParamsDto extends PartialType(CategoryQueryDto) {}
