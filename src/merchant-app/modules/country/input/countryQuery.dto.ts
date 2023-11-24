import { Field } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/input/BaseQuery.dto';

export class CountryQueryDto extends BaseQuery {
  @Field()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  client_status?: string;

  @Field()
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  stores_status?: string;
}
