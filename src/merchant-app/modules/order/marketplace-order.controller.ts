import { Body, Controller, Get, Header, Headers, Param, Patch, Post, Query, Req, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Public } from '../common/decorators';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { User } from '../models';
import { GetAllClientHistoryDto } from './dto/create-client-order-history.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { findAllOrderQueryDto } from './dto/find-all-order.dto';
import { MarketplaceOrderService } from './marketplace-order.service';
import { Request } from 'express';
import { EstimateStoreOrderFeesDto } from './dto/client-estimate-store-order-fees.dto';

@ApiBearerAuth()
@Controller('marketplace/orders')
@ApiTags(swaggerResources.MarketplaceOrder)
export class MarketplaceOrderController {
  constructor(private readonly OrderService: MarketplaceOrderService) {}

  @Post()
  @ApiResponse({ description: 'This for order', status: 201 })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User, @Req() request: Request) {
    return this.OrderService.create(createOrderDto, user, request?.headers?.['accept-language']);
  }

  @Get()
  @ApiResponse({ description: 'Return array of orders with client Id', status: 200 })
  findAll(@CurrentUser() user: User, @Query() query: findAllOrderQueryDto) {
    return this.OrderService.findAll(user, query);
  }

  @Patch(':orderId/cancel')
  @ApiResponse({ description: 'This for cancel order client', status: 200 })
  cancel(@Param('orderId') orderId: string, @CurrentUser() user: User) {
    return this.OrderService.cancelOrder(orderId, user);
  }

  @Get('/findActiveOrder')
  findLastOrder(@CurrentUser() user: any) {
    return this.OrderService.findLastOrder(user);
  }

  @Public()
  @Get('chargesOrderFees')
  chargesOrderFees(@CurrentUser() user: any, @Query() query: EstimateStoreOrderFeesDto) {
    return this.OrderService.chargesOrderFees(user, query);
  }

  @Get('/:orderId')
  findOne(@Param('orderId', ValidateMongoId) orderId: string) {
    return this.OrderService.findOne(orderId);
  }

  @Get('recommend/client-suggestions')
  getClientOrderingHistory(@CurrentUser() user: any, @Query() query: GetAllClientHistoryDto) {
    return this.OrderService.getClientOrderingHistory(user, query);
  }

  @Public()
  @ApiResponse({
    description: 'Generate pdf for given invoice Id',
  })
  @Get('gen-invoice/:id')
  @Header('Content-Type', 'application/pdf')
  async invoice(@Param('id') id: string, @Headers('accept-language') lang: any) {
    let buffer;
    if (lang === 'ar') {
      buffer = await this.OrderService.generateArabicInvoice({ id });
    } else {
      buffer = await this.OrderService.generateEnglishInvoice(id);
    }
    return new StreamableFile(buffer);
  }
}
