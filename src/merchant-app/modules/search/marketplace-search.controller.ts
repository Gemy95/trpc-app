import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { SearchDto } from './dto/search-merchant.dto';
import { MarketplaceSearchService } from './marketplace-search.service';

@Public()
@Controller('marketplace/search')
@ApiTags(swaggerResources.MarketplaceSearch)
export class MarketplaceSearchController {
  constructor(private marketplaceSearchService: MarketplaceSearchService) {}

  @Get('/merchants')
  @ApiResponse({ description: 'This for getting merchants', status: 200 })
  search(@Query() query: SearchDto) {
    return this.marketplaceSearchService.search(query);
  }
}
