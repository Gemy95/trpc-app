import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../models';

import { GetAllClientCategoryDto } from './dto/get-all-client-category.dto';

@Injectable()
export class MarketPlaceCategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAll(query: GetAllClientCategoryDto) {
    return this.categoryRepo.getAllClientCategories(query);
  }
}
