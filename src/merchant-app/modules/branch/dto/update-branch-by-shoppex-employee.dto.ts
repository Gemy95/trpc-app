import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  BRANCH_STATUS,
  BRANCH_STATUS_TAGS,
  ONLINE_STATUS,
  VISIBILITY_STATUS,
} from '../../common/constants/branch.constants';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchByShoppexEmployeeDto extends PartialType(CreateBranchDto) {
  // @ApiProperty({ default: APPROVED_STATUS, enum: BUILD_STATUS, required: false })
  // @IsOptional()
  // @IsEnum(BUILD_STATUS)
  // build_status: BUILD_STATUS;

  // @ApiProperty({ default: PRODUCTION_STATUS, enum: RELEASE_STATUS, required: false })
  // @IsOptional()
  // @IsEnum(RELEASE_STATUS)
  // release_status: RELEASE_STATUS;

  @ApiProperty({ default: BRANCH_STATUS.APPROVED_STATUS, enum: BRANCH_STATUS, required: false })
  @IsOptional()
  @IsEnum(BRANCH_STATUS)
  status: BRANCH_STATUS;

  @ApiProperty({ default: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS, enum: BRANCH_STATUS_TAGS, required: false })
  @IsOptional()
  @IsEnum(BRANCH_STATUS_TAGS)
  status_tags: BRANCH_STATUS_TAGS;

  @ApiProperty({ default: ONLINE_STATUS, enum: VISIBILITY_STATUS, required: false })
  @IsOptional()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status: VISIBILITY_STATUS;
}
