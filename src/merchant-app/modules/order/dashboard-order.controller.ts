import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import OrderPermissions from '../common/permissions/order.permissions';
import { DashboardOrderService } from './dashboard-order.service';
import { DashboardCreateOrderDto } from './dto/dashboard-create-order.dto';
import { DashboardOrderQueryDto } from './dto/dashboard-orders-query.dto';
import { DashboardOrderRejectDto } from './dto/order-rejected.dto';
import { DashboardOrderAcceptedDto } from './dto/order-accepted.dto';

@Controller('dashboard/orders')
@ApiTags(swaggerResources.DashboardOrder)
@ApiBearerAuth()
export class DashboardOrderController {
  constructor(private readonly OrderService: DashboardOrderService) {}

  @Post()
  @ApiResponse({ description: 'This for creating order client', status: 201 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@CurrentUser() user: any, @Body() createOrderDto: DashboardCreateOrderDto, @Req() request: Request) {
    return this.OrderService.create(user, createOrderDto, request?.headers?.['accept-language']);
  }

  @Get('branch/:branchId')
  @ApiResponse({ description: 'This for getting orders', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Param('branchId') branchId: string, @Query() query: DashboardOrderQueryDto) {
    return this.OrderService.findAll(query, branchId);
  }

  @Get(':orderId')
  @ApiResponse({ description: 'This for getting order client', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(@CurrentUser() user: any, @Param('orderId', ValidateMongoId) orderId: string) {
    return this.OrderService.orderDetails(user, orderId);
  }

  @Patch(':orderId/accept')
  @ApiResponse({ description: 'This for getting order client', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  acceptOrder(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dashboardOrderAcceptedDto: DashboardOrderAcceptedDto,
  ) {
    return this.OrderService.acceptOrder(user, orderId, dashboardOrderAcceptedDto);
  }

  @Patch(':orderId/cancel')
  @ApiResponse({ description: 'This for cancel order client', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  cancel(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.OrderService.cancelOrder(user, orderId);
  }

  @Patch(':orderId/reject')
  @ApiResponse({ description: 'This for reject order client', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reject(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dashboardOrderRejectDto: DashboardOrderRejectDto,
  ) {
    return this.OrderService.rejectOrder(user, orderId, dashboardOrderRejectDto);
  }

  @Patch(':orderId/ready')
  @ApiResponse({ description: 'This for change order status to ready order client', status: 200 })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  ready(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.OrderService.ready(user, orderId);
  }

  @Patch(':orderId/delivered')
  @ApiResponse({
    description: 'This for change order status to delivered order client',
    status: 200,
  })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  delivered(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.OrderService.delivered(user, orderId);
  }

  @Get('/:merchantId/:clientId/history')
  @ApiOkResponse({
    description: 'Provice client count history on specefic branch',
  })
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientHistory(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('clientId', ValidateMongoId) clientId: string,
  ) {
    return this.OrderService.clientHistory(merchantId, clientId);
  }
}
