import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchGroupDto } from './create-branch-group.dto';

export class UpdateBranchGroupDto extends PartialType(CreateBranchGroupDto) {}
