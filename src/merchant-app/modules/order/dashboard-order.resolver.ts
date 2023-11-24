import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import OrderPermissions from '../common/permissions/order.permissions';
import { DashboardOrderService } from './dashboard-order.service';
import { DashboardCreateOrderDto } from './dto/dashboard-create-order.dto';
import { DashboardOrderQueryDto } from './dto/dashboard-orders-query.dto';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { DashboardOrderRejectDto } from './dto/order-rejected.dto';
import { DashboardOrderAcceptedDto } from './dto/order-accepted.dto';
import { FindAllClientsClusteringDto } from './dto/dashboard-find-all-client-clustering.dto';

@Resolver('')
export class DashboardOrderResolver {
  constructor(private readonly OrderService: DashboardOrderService) {}

  @Mutation('dashboardCreateOrder')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardCreateOrder(
    @CurrentUser() user: any,
    @Args('createOrderDto') createOrderDto: DashboardCreateOrderDto,
    @Context() context: GraphQLExecutionContext,
  ) {
    return this.OrderService.create(user, createOrderDto, context?.['req']?.['header']?.('accept-language'));
  }

  @Query('dashboardFindAllOrdersByBranch')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardFindAllOrdersByBranch(@Args('branchId') branchId: string, @Args('query') query: DashboardOrderQueryDto) {
    return this.OrderService.findAll(query, branchId);
  }

  @Query('dashboardFindOneOrder')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardFindOneOrder(@CurrentUser() user: any, @Args('orderId', ValidateMongoId) orderId: string) {
    return this.OrderService.orderDetails(user, orderId);
  }

  @Mutation('dashboardOrderAccept')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  acceptOrder(
    @CurrentUser() user: any,
    @Args('orderId') orderId: string,
    @Args('dashboardOrderAcceptedDto') dashboardOrderAcceptedDto: DashboardOrderAcceptedDto,
  ) {
    return this.OrderService.acceptOrder(user, orderId, dashboardOrderAcceptedDto);
  }

  @Mutation('dashboardOrderCancel')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardOrderCancel(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.cancelOrder(user, orderId);
  }

  @Mutation('dashboardOrderReject')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardOrderReject(
    @CurrentUser() user: any,
    @Args('orderId') orderId: string,
    @Args('dashboardOrderRejectDto') dashboardOrderRejectDto: DashboardOrderRejectDto,
  ) {
    return this.OrderService.rejectOrder(user, orderId, dashboardOrderRejectDto);
  }

  @Mutation('dashboardOrderReady')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardOrderReady(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.ready(user, orderId);
  }

  @Mutation('dashboardOrderDelivered')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  dashboardOrderDelivered(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.delivered(user, orderId);
  }

  @Query('dashboardOrderClientHistory')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientHistory(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('clientId', ValidateMongoId) clientId: string,
  ) {
    return this.OrderService.clientHistory(merchantId, clientId);
  }

  @Query('dashboardFindAllClientsClustering')
  dashboardFindAllClientsClustering(@Args('query') query: FindAllClientsClusteringDto) {
    return this.OrderService.dashboardFindAllClientsClustering(query);
  }
}
