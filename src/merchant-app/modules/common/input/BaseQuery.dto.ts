import { Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PopulateOption, SortOrder } from 'mongoose';

export class BaseQuery {
  // @Field()
  @IsOptional()
  @IsString()
  search?: string;

  // @Field()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  // @Field()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;

  // @Field()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  paginate?: boolean;

  // @Field()
  @IsOptional()
  fields?: any;

  // @Field()
  @IsOptional()
  sort?: object;

  // @Field()
  @IsOptional()
  populate?: PopulateOption;
}
