import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PopulateOption, SortOrder } from 'mongoose';

export class BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  paginate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  fields?: any;

  @ApiPropertyOptional({
    examples: [
      {
        createdAt: 1,
      },
      {
        updateAt: 1,
      },
    ],
  })
  @IsOptional()
  sort?: object;

  @ApiPropertyOptional()
  @IsOptional()
  populate?: PopulateOption;
}
