import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BUILD_STATUS, RELEASE_STATUS } from '../../common/constants/product';
import { STATUS } from '../../common/constants/status.constants';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetAllProductDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  categories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  branches?: string[];

  @ApiPropertyOptional({ enum: BUILD_STATUS })
  @IsOptional()
  @IsEnum(BUILD_STATUS)
  build_status?: BUILD_STATUS;

  @ApiPropertyOptional({ enum: STATUS })
  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

  @ApiPropertyOptional({ enum: RELEASE_STATUS })
  @IsOptional()
  @IsEnum(RELEASE_STATUS)
  release_status?: RELEASE_STATUS;
}
