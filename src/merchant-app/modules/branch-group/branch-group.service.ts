import { Injectable } from '@nestjs/common';
import { BranchGroupRepository } from '../models';
import { UpdateBranchGroupDto } from './dto/update-branch-group.dto';
import { CreateBranchGroupDto } from './dto/create-branch-group.dto';
import { FindAllBranchGroupDto } from './dto/findAll-branch-group.dto';

@Injectable()
export class BranchGroupService {
  constructor(private readonly branchGroupRepository: BranchGroupRepository) {}

  async create(createBranchGroupDto: CreateBranchGroupDto) {
    return this.branchGroupRepository.createOne(createBranchGroupDto);
  }

  async getOne(branchGroupId: string) {
    return this.branchGroupRepository.getOne(branchGroupId);
  }

  async getAll(params: FindAllBranchGroupDto) {
    return this.branchGroupRepository.getAll(params);
  }

  async updateOne(branchGroupId: string, updateBranchGroupDto: UpdateBranchGroupDto) {
    return this.branchGroupRepository.updateOne(branchGroupId, updateBranchGroupDto);
  }

  async deleteOne(branchGroupId: string) {
    return this.branchGroupRepository.remove(branchGroupId);
  }
}
