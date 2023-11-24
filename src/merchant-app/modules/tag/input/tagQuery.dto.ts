import { Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/input/BaseQuery.dto';

export class TagQueryDto extends BaseQuery {
  // @Field()
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  // @Field()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  categories?: string[];

  // @Field()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  client_visibility: boolean = undefined;

  // @Field()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  stores_visibility: boolean = undefined;
}
