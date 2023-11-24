import { Field } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/input/BaseQuery.dto';

export class CityQueryDto extends BaseQuery {
  // @Field()
  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  client_status: string;

  // @Field()
  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  stores_status: string;

  // @Field()
  @IsOptional()
  @IsString({ each: true })
  countries?: string[];
}
