import { Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Order {
  asc = 1,
  desc = -1,
}

export class GetAllDto {
  @Field()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 0;

  @Field()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 25;

  @Field()
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @Field()
  @IsOptional()
  @IsBoolean()
  paginate?: boolean;

  @Field()
  @IsOptional()
  @IsEnum(Order)
  @IsNumber()
  @Type(() => Number)
  order?: number = -1;
}
