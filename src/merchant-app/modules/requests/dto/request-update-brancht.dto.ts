import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from '../../branch/dto/create-branch.dto';

export class RequestUpdateBranchDto extends PartialType(CreateBranchDto) {}
