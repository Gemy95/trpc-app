import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class TagQueryDto extends BaseQuery {
  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  categories?: string[];

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
