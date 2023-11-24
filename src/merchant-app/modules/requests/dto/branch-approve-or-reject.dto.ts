import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { BRANCH_RESERVATION_STATUS, BRANCH_STATUS, BRANCH_STATUS_TAGS } from '../../common/constants/branch.constants';

export class BranchApproveOrRejectDto {
  @ApiProperty({ enum: BRANCH_STATUS })
  @IsOptional()
  @IsEnum(BRANCH_STATUS)
  status: BRANCH_STATUS;

  @ApiProperty({ enum: BRANCH_STATUS_TAGS })
  @ApiProperty()
  @IsEnum(BRANCH_STATUS_TAGS)
  status_tags: BRANCH_STATUS_TAGS;

  @ApiPropertyOptional()
  @IsOptional()
  notes?: string[];
}
