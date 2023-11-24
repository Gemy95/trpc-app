import { Injectable, NotFoundException } from '@nestjs/common';
import { GetAllDto } from '../common/dto/get-all.dto';
import { BranchCategoryRepository } from '../models';
// import { BranchRepository } from '../database/models/branch/branch.repository';
import { CreateBranchCategoryDto } from './dto/create-branch-category.dto';
import { UpdateBranchCategoryDto } from './dto/update-branch-category.dto';

@Injectable()
export class BranchCategoryService {
  constructor(
    private branchCategoryRepository: BranchCategoryRepository, // private branchRepository: BranchRepository,
  ) {}

  async create(createBranchCategoryDto: CreateBranchCategoryDto) {
    // const { branchId } = createBranchCategoryDto;

    // const isBranchExists = await this.branchRepository.exists({
    //   _id: branchId,
    // });

    // if (!isBranchExists) {
    //   throw new NotFoundException(`This branchId (${branchId}) not exists`);
    // }

    return this.branchCategoryRepository.create(createBranchCategoryDto);
  }

  findAll(branchId: string, query: GetAllDto) {
    const { limit, order, page, sortBy } = query;
    return this.branchCategoryRepository.getAll(
      { isDeleted: false, branchId },
      { limit, page, paginate: true, sort: { [sortBy]: order } },
    );
  }

  findOne(id: string) {
    return this.branchCategoryRepository.getOne({ isDeleted: false, _id: id });
  }

  update(id: string, updateBranchCategoryDto: UpdateBranchCategoryDto) {
    return this.branchCategoryRepository.updateOne(
      {
        isDeleted: false,
        _id: id,
      },
      updateBranchCategoryDto,
      { new: true },
    );
  }

  async remove(id: string) {
    const branchCategory = await this.branchCategoryRepository.exists({
      _id: id,
      isDeleted: false,
    });

    if (!branchCategory) {
      throw new NotFoundException('This category not exists');
    }

    return this.branchCategoryRepository.deleteOne(id);
  }
}
