import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { VISIBILITY_STATUS } from '../../common/constants/branch.constants';

export class OnlineOfflineBranchDto {
  @ApiProperty({ enum: [VISIBILITY_STATUS.OFFLINE_STATUS, VISIBILITY_STATUS.ONLINE_STATUS] })
  @IsEnum([VISIBILITY_STATUS.OFFLINE_STATUS, VISIBILITY_STATUS.ONLINE_STATUS])
  visibility_status: string;

  @ApiProperty()
  @IsOptional()
  notes?: string[];
}
