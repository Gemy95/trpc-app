import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BranchGateWayDto {
  @ApiProperty()
  @IsString()
  roomId: string;
}
