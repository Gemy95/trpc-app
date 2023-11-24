import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { GetAllNearByDto, GetAllNearByFilterObject } from './dto/get-all-nearby-with-filters.dto';
import { GetAllNearestDto } from './dto/get-all-nearest-with-filter.dto';
import { MerchantBranchesDto } from './dto/merchant-branches-query.dto';
import { MarketplaceBranchService } from './marketplace-branch.service';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';

@Public()
@Controller('marketplace')
@ApiTags(swaggerResources.MarketplaceBranch)
export class MarketplaceBranchController {
  constructor(private readonly marketPlacebranchService: MarketplaceBranchService) {}

  @Get('/:merchantId/branches')
  @ApiResponse({ description: 'This for getting branches', status: 200 })
  findAll(@Param('merchantId', ValidateMongoId) merchantId: string, @Query() query: MerchantBranchesDto) {
    return this.marketPlacebranchService.findAll(merchantId, query);
  }

  @Get('/branches/nearest')
  @ApiResponse({ description: 'This for getting nearest branches', status: 200 })
  getNearestBranches(@Query() query: GetAllNearestDto) {
    return this.marketPlacebranchService.getNearestBranches(query);
  }

  @Get('/branches/nearby')
  @ApiQuery({
    required: false,
    name: 'filters',
    explode: true,
    type: 'object',
    schema: {
      $ref: getSchemaPath(GetAllNearByFilterObject),
    },
  })
  @ApiResponse({ description: 'This for getting near by branches', status: 200 })
  getNearByBranches(@Query() query: GetAllNearByDto, @Query('filters') filters: any) {
    return this.marketPlacebranchService.getNearByBranches(
      query,
      typeof filters === 'string' ? JSON.parse(filters) : filters,
    );
  }
}
