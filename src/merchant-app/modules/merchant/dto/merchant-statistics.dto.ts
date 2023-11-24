import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional } from 'class-validator';

export class FindMerchantStatisticsDto {
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

  @ApiProperty()
  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => String)
  branchesIds?: string[];
}
