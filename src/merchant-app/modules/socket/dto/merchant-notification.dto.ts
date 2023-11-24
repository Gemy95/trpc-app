import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MerchantGateWayDto {
  @ApiProperty()
  @IsString()
  roomId: string;
}
