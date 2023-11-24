import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketplaceSearchService } from './marketplace-search.service';
import { SearchDto } from './zod/search-merchant.dto';

@Injectable()
export class MarketplaceSearchRouter {
  constructor(private marketplaceSearchService: MarketplaceSearchService, private trpcService: TrpcService) {}

  searchMerchants = this.trpcService.publicProcedure.input(SearchDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = SearchDto.parse(input);
    return this.marketplaceSearchService.search(parsedInput);
  });

  routers = this.trpcService.router({
    searchMerchants: this.searchMerchants,
  });
}
