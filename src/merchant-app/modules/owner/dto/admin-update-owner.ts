import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { OWNER_ACTIVE_STATUS, OWNER_STATUS } from '../../common/constants/owner.constants';
import { CreateOwnerDto } from './create-owner.dto';

export class AdminUpdateOwnerDto extends PartialType(CreateOwnerDto) {
  @ApiProperty({ default: OWNER_ACTIVE_STATUS, enum: OWNER_STATUS, required: false })
  @IsOptional()
  @IsEnum(OWNER_STATUS)
  status?: OWNER_STATUS;
}
