import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import { SearchDto } from './dto/search-merchant.dto';
import { MarketplaceSearchService } from './marketplace-search.service';

@Public()
@Resolver('')
export class MarketplaceSearchResolver {
  constructor(private marketplaceSearchService: MarketplaceSearchService) {}

  @Query('marketplaceSearchMerchants')
  search(@Args('query') query: SearchDto) {
    return this.marketplaceSearchService.search(query);
  }
}
