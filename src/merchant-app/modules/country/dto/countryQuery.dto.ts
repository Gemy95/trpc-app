import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class CountryQueryDto extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  client_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(STATUS)
  stores_status?: string;
}
