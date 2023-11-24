import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '../models';

@Injectable()
export class MarketplaceMerchantService {
  constructor(private merchantRepository: MerchantRepository) {}

  getMarketplaceMerchantinfo(merchantId: string, clientId?: string) {
    return this.merchantRepository.getMarketplaceMerchantinfo(merchantId, clientId);
  }
}
