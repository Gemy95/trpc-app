import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { MERCHANT_STATUS } from '../../common/constants/merchant';

export class ReApplyDto {
  readonly status: string = MERCHANT_STATUS.PENDING_STATUS;

  @ApiProperty()
  @IsString()
  merchantId: string;

  @ApiProperty()
  @IsOptional()
  notes?: string[];
}
