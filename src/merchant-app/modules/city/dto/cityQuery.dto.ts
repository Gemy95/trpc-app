import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class CityQueryDto extends BaseQuery {
  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  client_status: string;

  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  stores_status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  countries?: string[];
}
