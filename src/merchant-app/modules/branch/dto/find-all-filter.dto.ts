import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { BRANCH_STATUS, BRANCH_STATUS_TAGS, VISIBILITY_STATUS } from '../../common/constants/branch.constants';
import { BaseQuery } from '../../common/input/BaseQuery.dto';

export class FindAllBranchDto extends PartialType(BaseQuery) {
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  cities?: string[];

  @ApiPropertyOptional({ enum: BRANCH_STATUS })
  @IsEnum(BRANCH_STATUS)
  status: BRANCH_STATUS;

  @ApiPropertyOptional({ enum: BRANCH_STATUS_TAGS })
  @IsOptional()
  @IsEnum(BRANCH_STATUS_TAGS)
  status_tags: BRANCH_STATUS_TAGS;

  @ApiPropertyOptional({ enum: VISIBILITY_STATUS })
  @IsOptional()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status: VISIBILITY_STATUS;
}
