import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class FindDashboardMerchantsStatisticsDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromCreatedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toCreatedAt?: Date;
}
