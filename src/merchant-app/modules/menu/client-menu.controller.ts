import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { ClientMenuService } from './client-menu.service';
import { MenuQueryDto } from './dto/menu-query.dto';

@Public()
@Controller('clients/:merchantId/menu')
@ApiTags(swaggerResources.MarketplaceMenu)
export class ClientMenuController {
  constructor(private readonly clientMenuService: ClientMenuService) {}

  @ApiResponse({
    description: 'Client MobileApp - Get Menu for merchant by Id',
    status: 200,
  })
  @ApiQuery({
    name: 'branchId',
    required: true,
  })
  @CacheTTL(20)
  @UseInterceptors(CacheInterceptor)
  @Get()
  getMenuByBranchId(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query() params: MenuQueryDto,
    @Req() request: Request,
  ) {
    return this.clientMenuService.marketplaceMenu(merchantId, params, request?.headers?.['accept-language']);
  }
}
