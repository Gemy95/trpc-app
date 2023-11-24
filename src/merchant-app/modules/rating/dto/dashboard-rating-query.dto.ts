import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsDate, IsString } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class DashboardRatingQuery extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  branches?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(0, 0, 0, 0)))
  @IsDate()
  fromCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(23, 59, 59, 999)))
  @IsDate()
  toCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  levels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderRefId?: string;
}
