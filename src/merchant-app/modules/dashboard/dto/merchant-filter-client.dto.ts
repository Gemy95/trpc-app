import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class MerchantFiltersClientQuery extends PartialType(BaseQuery) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile: string;
}
