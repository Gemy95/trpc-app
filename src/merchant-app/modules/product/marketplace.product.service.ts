import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { MerchantRepository, ProductRepository } from '../models';
import { MarketplaceGetAllProductDto } from './dto/marketplace-get-all-product.dto';

@Injectable()
export class MarketplaceProductService {
  constructor(private productRepository: ProductRepository, private merchantRepository: MerchantRepository) {}

  // async findOne(id: string, user: any) {
  //   const merchant = await this.getMerchantByOwnerId(user._id);

  //   return this.productRepository.getOne({ isDeleted: false, _id: id, merchantId: merchant._id }, { lean: true });
  // }

  async findOne(id: string, user: any) {
    return this.productRepository.getOne({ isDeleted: false, _id: id }, { lean: true });
  }

  async findAll(args: MarketplaceGetAllProductDto) {
    const { limit, order, page, sortBy, merchantId, categoryId } = args;

    const query: any = { isDeleted: false };

    if (merchantId) {
      query.merchantId = merchantId;
    }

    if (categoryId) {
      query.categoriesIds = categoryId;
    }

    return this.productRepository.getAll(query, {
      limit,
      page,
      paginate: true,
      sort: { [sortBy]: order },
    });
  }

  private async getMerchantByOwnerId(id) {
    const merchant: any = await this.merchantRepository.getOne({
      isDeleted: false,
      ownerId: id,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    return merchant;
  }
}
