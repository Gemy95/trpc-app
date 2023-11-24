import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Public } from '../common/decorators';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { MarketplaceMerchantService } from './marketplace-merchant.service';

@Public()
// @ApiBearerAuth()
@Controller('marketplace')
@ApiTags(swaggerResources.MarketplaceMerchant)
export class MarketplaceMerchantController {
  constructor(private readonly marketPlacemerchantService: MarketplaceMerchantService) {}

  @ApiQuery({
    name: 'clientId',
    required: false,
    description: 'client Id for check if merchant is liked or not',
  })
  @Get('merchant-info/:merchantId/')
  @ApiResponse({ description: 'Fetch merchant info for marketplace', status: 200 })
  findAll(@Param('merchantId', ValidateMongoId) merchantId: string, @Query('clientId') clientId: any) {
    return this.marketPlacemerchantService.getMarketplaceMerchantinfo(merchantId, clientId);
  }
}
