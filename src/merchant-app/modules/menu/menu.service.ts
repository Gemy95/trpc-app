import { Injectable } from '@nestjs/common';
import {
  BranchRepository,
  MerchantRepository,
  ProductCategoryRepository,
  ProductGroupRepository,
  ProductRepository,
} from '../models';
import { MenuSharedService } from './shared/menu.shared.service';

@Injectable()
export class MenuService extends MenuSharedService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly branchRepository: BranchRepository,
    private readonly productRepository: ProductRepository,
    private readonly productGroupRepository: ProductGroupRepository,
  ) {
    super(merchantRepository, productCategoryRepository, branchRepository, productRepository, productGroupRepository);
  }
}
