import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ONLINE_STATUS, OFFLINE_STATUS } from '../../common/constants/merchant';

export class OnlineOrOfflineMerchantDto {
  @ApiProperty()
  @IsEnum([ONLINE_STATUS, OFFLINE_STATUS])
  status: string;

  @ApiProperty()
  @IsString()
  merchantId: string;

  @ApiProperty()
  @IsOptional()
  notes?: string[];

  ownerId?: string;
}
