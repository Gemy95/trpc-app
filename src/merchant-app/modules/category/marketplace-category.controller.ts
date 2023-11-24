import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { GetAllClientCategoryDto } from './dto/get-all-client-category.dto';
import { MarketPlaceCategoryService } from './marketplace-category.service';

@Controller('marketplace/categories')
@ApiTags(swaggerResources.MarketplaceCategory)
export class MarketPlaceCategoryController {
  constructor(private readonly marketPlaceCategoryService: MarketPlaceCategoryService) {}

  @Public()
  @Get()
  @ApiResponse({ description: 'client get all category', status: 200 })
  all(@Query() query: GetAllClientCategoryDto) {
    return this.marketPlaceCategoryService.getAll(query);
  }
}
