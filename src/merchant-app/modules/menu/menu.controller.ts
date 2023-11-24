import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Public } from '../common/decorators';
import { MenuQueryDto } from './dto/menu-query.dto';
import { MenuService } from './menu.service';
import { Request } from 'express';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Public()
@Controller('merchants/:merchantId/menu')
@ApiTags(swaggerResources.MerchantMenu)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiResponse({
    description: 'Merchant WebApp - Get Menu for merchant by Id',
    status: 200,
  })
  @ApiQuery({
    name: 'branchId',
    required: true,
  })
  @Get()
  getMenuByBranchId(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query() params: MenuQueryDto,
    @Req() request: Request,
  ) {
    //  return this.menuService.getMerchantMenu(merchantId, params, request?.headers?.['accept-language']);
  }
}
