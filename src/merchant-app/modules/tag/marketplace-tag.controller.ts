import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { ParseQueryJSON } from '../pipes/parseQueryJson.pipe';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { GetAllClientTagDto } from './dto/get-all-client-tag.dto';
import { MarketPlaceTagService } from './marketplace-tag.service';

@Controller('marketplace/tags')
@ApiTags(swaggerResources.MarketplaceTag)
@ApiBearerAuth()
export class MarketPlaceTagController {
  constructor(private readonly marketPlaceTagService: MarketPlaceTagService) {}

  @Public()
  @Get()
  @ApiQuery({
    name: 'categoriesIds',
    example: '[{ "categoryId": "62b2507ec2a0d0f0af0dbfd1"}]',
    required: true,
  })
  @ApiResponse({ description: 'client get all tag', status: 200 })
  all(
    @Query(new ValidationPipe({ transform: true })) query: GetAllClientTagDto,
    @Query('categoriesIds', new ParseQueryJSON()) categoriesIds,
  ) {
    return this.marketPlaceTagService.getAll(query, categoriesIds);
  }
}
