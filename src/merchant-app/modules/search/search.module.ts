import { forwardRef, Module } from '@nestjs/common';

import { MarketplaceSearchRouter } from '../../modules/search/marketplace-search.router';
import { TrpcModule } from '../../trpc/trpc.module';
import { MerchantModule } from '../merchant/merchant.module';
import { ProductModule } from '../product/product.module';
import { MarketplaceSearchController } from './marketplace-search.controller';
import { MarketplaceSearchResolver } from './marketplace-search.resolver';
import { MarketplaceSearchService } from './marketplace-search.service';

@Module({
  imports: [MerchantModule, forwardRef(() => ProductModule), forwardRef(() => TrpcModule)],
  controllers: [MarketplaceSearchController],
  providers: [MarketplaceSearchService, MarketplaceSearchResolver, MarketplaceSearchRouter],
  exports: [MarketplaceSearchRouter],
})
export class SearchModule {}
