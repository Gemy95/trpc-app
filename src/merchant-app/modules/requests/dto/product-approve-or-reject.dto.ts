import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { APPROVED_STATUS, REJECTED_STATUS } from '../../common/constants/product';

export class ProductApproveOrReject {
  @ApiPropertyOptional({ enum: [REJECTED_STATUS, APPROVED_STATUS] })
  @IsOptional()
  @IsEnum([REJECTED_STATUS, APPROVED_STATUS])
  build_status: string;

  @ApiPropertyOptional({ enum: [APPROVED_STATUS, REJECTED_STATUS] })
  @IsOptional()
  @IsEnum([APPROVED_STATUS, REJECTED_STATUS])
  approveStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  notes?: string[];
}
