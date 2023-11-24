import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import OrderPermissions from '../common/permissions/order.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { DriverOrderService } from './driver-order.service';
import { DriverOrderQueryDto } from './dto/driver-orders-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/shared/decorator/user.decorator';

@ApiBearerAuth()
@Controller('driver/orders')
@ApiTags(swaggerResources.DriverOrder)
export class DriverOrderController {
  constructor(private readonly orderService: DriverOrderService) {}

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get('driverFindAllOrdersByBranch')
  driverFindAllOrdersByBranch(
    @Query('branchId') branchId: string,
    @Query('query') query: DriverOrderQueryDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.driverFindAllOrder(query, branchId, user);
  }

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get('driverFindOneOrder')
  driverFindOneOrder(@CurrentUser() user: any, @Query('orderId', ValidateMongoId) orderId: string) {
    return this.orderService.driverOrderDetails(user, orderId);
  }

  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('driverOrderOnWayToClient')
  onWayToClientOrder(@CurrentUser() user: any, @Query('orderId') orderId: string) {
    return this.orderService.onWayToClientOrder(user, orderId);
  }

  @Patch('driverOrderArrivedToClient')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  arrivedToClientOrder(@CurrentUser() user: any, @Query('orderId') orderId: string) {
    return this.orderService.arrivedToClientOrder(user, orderId);
  }

  @Patch('driverOrderDeliveredToClient')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  deliveredToClientOrder(@CurrentUser() user: any, @Query('orderId') orderId: string) {
    return this.orderService.deliveredToClientOrder(user, orderId);
  }

  @Patch('driverOrderClientNotRespond')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientNotRespondOrder(@CurrentUser() user: any, @Query('orderId') orderId: string) {
    return this.orderService.clientNotRespondOrder(user, orderId);
  }

  @Patch('driverOrderClientNotDelivered')
  @Permissions(OrderPermissions.ALL_PERMISSION.value, OrderPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  clientNotDeliveredOrder(@CurrentUser() user: any, @Query('orderId') orderId: string) {
    return this.orderService.clientNotDeliveredOrder(user, orderId);
  }
}
