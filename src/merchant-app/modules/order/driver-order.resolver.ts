import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import OrderPermissions from '../common/permissions/order.permissions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { DriverOrderService } from './driver-order.service';
import { DriverOrderQueryDto } from './dto/driver-orders-query.dto';

@Resolver('')
export class DriverOrderResolver {
  constructor(private readonly OrderService: DriverOrderService) {}

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('driverFindAllOrdersByBranch')
  driverFindAllOrdersByBranch(
    @Args('branchId') branchId: string,
    @Args('query') query: DriverOrderQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.OrderService.driverFindAllOrder(query, branchId, user);
  }

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('driverFindOneOrder')
  driverFindOneOrder(@CurrentUser() user: any, @Args('orderId', ValidateMongoId) orderId: string) {
    return this.OrderService.driverOrderDetails(user, orderId);
  }

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('driverOrderOnWayToClient')
  onWayToClientOrder(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.onWayToClientOrder(user, orderId);
  }

  @Mutation('driverOrderArrivedToClient')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  arrivedToClientOrder(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.arrivedToClientOrder(user, orderId);
  }

  @Mutation('driverOrderDeliveredToClient')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  deliveredToClientOrder(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.deliveredToClientOrder(user, orderId);
  }

  @Mutation('driverOrderClientNotRespond')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientNotRespondOrder(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.clientNotRespondOrder(user, orderId);
  }

  @Mutation('driverOrderClientNotDelivered')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientNotDeliveredOrder(@CurrentUser() user: any, @Args('orderId') orderId: string) {
    return this.OrderService.clientNotDeliveredOrder(user, orderId);
  }
}
