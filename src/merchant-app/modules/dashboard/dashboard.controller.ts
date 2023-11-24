import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllDto } from '../common/dto/get-all.dto';
import { ClientService } from '../client/client.service';
import { AdminUpdateClientDto } from '../client/dto/admin-update-client.dto';
import { ClientOwnerTypesDetailsEnum } from '../common/constants/client.owner.types.details';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { DashboardOrderService } from '../order/dashboard-order.service';
import { DashboardOrderQueryDto } from '../order/dto/dashboard-orders-query.dto';
import { AdminUpdateOwnerDto } from '../owner/dto/admin-update-owner';
import { OwnerService } from '../owner/owner.service';
import { ClientFiltersQuery } from './dto/client-filters.dto';
import { OwnerFiltersQuery } from './dto/owner-filters.dto';
import { ReviewQuery } from './dto/review-query.dto';
import { RequestsService } from '../requests/requests.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly clientService: ClientService,
    private readonly ownerService: OwnerService,
    private readonly orderService: DashboardOrderService,
    private readonly requestsService: RequestsService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  @Get('clients')
  async getClients(@Query() filters: ClientFiltersQuery) {
    return this.clientService.getForDashboard(filters);
  }

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  @Get('owners')
  async getOwners(@Query() filters: OwnerFiltersQuery) {
    return this.ownerService.getForDashboard(filters);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiQuery({ name: 'client_owner_id', required: true, example: '' })
  @ApiQuery({
    name: 'client_owner_type',
    required: true,
    example: ClientOwnerTypesDetailsEnum.CLIENT,
    enum: ClientOwnerTypesDetailsEnum,
  })
  @Get('client-owner/details')
  async getClientDetailsById(
    @Query('client_owner_id') client_owner_id: string,
    @Query('client_owner_type') client_owner_type: ClientOwnerTypesDetailsEnum,
  ) {
    const client_owner =
      client_owner_type && client_owner_type === ClientOwnerTypesDetailsEnum.CLIENT
        ? (await this.clientService.getClientDetailsById(client_owner_id))?.[0] || {}
        : client_owner_type && client_owner_type === ClientOwnerTypesDetailsEnum.OWNER
        ? (await this.ownerService.getOwnerDetailsById(client_owner_id))?.[0] || {}
        : {};
    return client_owner;
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('client/:id')
  async updateclient(
    @Param('id') id: string,
    @Body() adminUpdateClientDto: AdminUpdateClientDto,
    @CurrentUser() user: any,
  ) {
    const client = await this.clientService.adminUpdateClient(id, adminUpdateClientDto, user);
    return client;
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('owner/:id')
  async updateOwner(@Param('id') id: string, @Body() adminUpdateOwnerDto: AdminUpdateOwnerDto) {
    const owner = await this.ownerService.adminUpdateOwner(id, adminUpdateOwnerDto);
    return owner;
  }

  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  @Get('owner/mobile-email')
  getByMobileOrEmail(@Query() query: 'email' | 'mobile') {
    return this.ownerService.getByMobileOrEmail(query);
  }

  @ApiBearerAuth()
  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  @ApiOkResponse({
    description: 'Get client orders history by merchantId',
  })
  @Get(':merchantId/customers')
  clientOrderingHistory(@Param('merchantId', ValidateMongoId) merchantId: string, @Query() query: GetAllDto) {
    return this.orderService.clientOrderingHistory(merchantId, query);
  }

  @ApiBearerAuth()
  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  @ApiOkResponse({
    description: 'Get client orders history by merchantId',
  })
  @Get('operation/orders')
  orders(@Query() query: DashboardOrderQueryDto) {
    return this.orderService.findAll(query);
  }

  @ApiBearerAuth()
  @Get('requests/review')
  @ApiResponse({
    description: 'Fetch update request',
    status: 200,
  })
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  getUpdateRequest(@Query() query: ReviewQuery) {
    return this.requestsService.findAllRequests(query);
  }

  @ApiBearerAuth()
  @Get('requests/:referenceId')
  @ApiResponse({
    description: 'Fetch update request',
    status: 200,
  })
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  getUpdateRequestByID(@Param('referenceId') referenceId: string) {
    return this.requestsService.findOne(referenceId);
  }
}
