import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
@ApiTags(swaggerResources.MarketplaceMerchant)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Public()
  @CacheTTL(20)
  @UseInterceptors(CacheInterceptor)
  @Get('merchant/:branchId/images')
  @ApiResponse({
    description: 'Fetch merchant images for marketplace information page',
  })
  merchantImages(@Param('branchId') branchId: string) {
    return this.marketplaceService.merchantMarketplaceImages(branchId);
  }
}
