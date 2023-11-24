import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MarketplaceGetAllProductDto } from './dto/marketplace-get-all-product.dto';
import { MarketplaceProductService } from './marketplace.product.service';

@Controller('marketplace/products')
@ApiTags(swaggerResources.MarketplaceProduct)
@ApiBearerAuth()
export class MarketplaceProductController {
  constructor(private readonly productService: MarketplaceProductService) {}

  @Get(':productId')
  @ApiResponse({ description: 'get one product', status: 200 })
  findOne(@Param('productId') productId: string, @CurrentUser() user: any) {
    return this.productService.findOne(productId, user);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'get all products' })
  findAll(@Query() getAllProductsDto: MarketplaceGetAllProductDto) {
    return this.productService.findAll(getAllProductsDto);
  }
}
