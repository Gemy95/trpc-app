import { Transform } from 'class-transformer';
import { IsOptional, IsDate, IsString } from 'class-validator';
import { GetAllDto } from '../../common/input/get-all.dto';

export class DashboardRatingQuery extends GetAllDto {
  @IsOptional()
  @IsString({ each: true })
  branches?: string[];

  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(0, 0, 0, 0)))
  @IsDate()
  fromCreatedAt?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(23, 59, 59, 999)))
  @IsDate()
  toCreatedAt?: Date;

  @IsOptional()
  @IsString({ each: true })
  levels?: string[];

  @IsOptional()
  @IsString()
  orderRefId?: string;
}
