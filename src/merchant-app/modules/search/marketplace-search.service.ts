import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../models';
import { MerchantRepository } from '../models/merchant/merchant.repository';
import { SearchDto } from './dto/search-merchant.dto';

@Injectable()
export class MarketplaceSearchService {
  constructor(private merchantRepository: MerchantRepository, private productRepository: ProductRepository) {}

  async search(searchDto: SearchDto | any) {
    const { product, merchant } = searchDto || {};
    let merchants, products;
    if (!product) {
      merchants = await this.merchantRepository.searchMerchants(searchDto);
    } else if (!merchant) {
      products = await this.productRepository.searchProducts(searchDto);
    } else {
      products = await this.productRepository.searchProducts(searchDto);
      merchants = await this.merchantRepository.searchMerchants(searchDto);
    }
    return {
      products,
      merchants,
    };
  }
}
