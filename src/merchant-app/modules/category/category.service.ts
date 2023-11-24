import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { StorageService } from '../../storage.service';
import generateFilters from '../common/utils/generate-filters';
import { CategoryDocument, CategoryRepository } from '../models';
import { CategoryDto } from './dto/category.dto';
import { CategoryQueryDto, CategoryQueryParamsDto } from './dto/categoryQuery.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(creteDto: CategoryDto): Promise<CategoryDocument> {
    return this.categoryRepository.create(creteDto);
  }

  async getAll(params: CategoryQueryDto | CategoryQueryParamsDto) {
    try {
      const { limit, page, paginate, sort, search, ...rest } = params;
      const generatedMatch = generateFilters(rest);
      const generatedSearch = generateFilters({ search });

      const result = await this.categoryRepository.getAll(
        { ...generatedMatch, ...generatedSearch },
        { limit, page, paginate, sort },
      );
      return result;
    } catch (error) {
      return { error, success: false };
    }
  }

  async getOne(id: string) {
    const category = await this.categoryRepository.getById(id, {});
    if (!category) {
      throw new NotFoundException(ERROR_CODES.err_category_not_found);
    }
    return category;
  }

  async updateOne(id: string, updateDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.getById(id, {});
    if (!category) {
      throw new NotFoundException(ERROR_CODES.err_category_not_found);
    }

    return this.categoryRepository.updateById(id, updateDto, { new: true }, {});
  }

  async deleteOne(id: string) {
    try {
      const category = await this.categoryRepository.getById(id, {});
      if (!category) {
        // TODO Review Later, shouldn't throw an error any more since graphql will throw an error as well!
        // throw new NotFoundException(ERROR_CODES.err_category_not_found);
        return { success: false, error: ERROR_CODES.err_category_not_found };
      }
      const result = await this.categoryRepository.deleteById(id);
      return { result, message: 'success', success: true };
    } catch (error) {
      return { error, success: false };
    }
  }
}
