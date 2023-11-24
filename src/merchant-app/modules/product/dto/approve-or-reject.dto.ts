import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  PRODUCT_APPROVED_STATUS,
  PRODUCT_PENDING_STATUS,
  PRODUCT_REJECTED_STATUS,
  PRODUCT_STATUS,
} from '../../common/constants/product';

export class ApproveOrRejectProductDto {
  @ApiProperty({ example: PRODUCT_APPROVED_STATUS, enum: PRODUCT_STATUS })
  @IsEnum([PRODUCT_APPROVED_STATUS, PRODUCT_REJECTED_STATUS])
  status: PRODUCT_STATUS;

  @ApiProperty()
  @IsOptional()
  notes?: string[];
}
