import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { VISIBILITY_STATUS } from '../../common/constants/branch.constants';

export class ChangeStatusDto {
  @ApiProperty({ enum: VISIBILITY_STATUS })
  @IsEnum(VISIBILITY_STATUS)
  visibility_status: string;

  @ApiProperty()
  @IsOptional()
  notes?: string[];
}
