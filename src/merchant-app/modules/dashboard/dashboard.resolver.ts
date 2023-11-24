import { GetAllDto } from '../common/dto/get-all.dto';
import { ClientService } from '../client/client.service';
import { AdminUpdateClientDto } from '../client/dto/admin-update-client.dto';
import { ClientOwnerTypesDetailsEnum } from '../common/constants/client.owner.types.details';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import MerchantPermissions from '../common/permissions/merchant.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { DashboardOrderService } from '../order/dashboard-order.service';
import { DashboardOrderQueryDto } from '../order/dto/dashboard-orders-query.dto';
import { AdminUpdateOwnerDto } from '../owner/dto/admin-update-owner';
import { OwnerService } from '../owner/owner.service';
import { ClientFiltersQuery } from './dto/client-filters.dto';
import { OwnerFiltersQuery } from './dto/owner-filters.dto';
import { ReviewQuery } from './dto/review-query.input';
import { RequestsService } from '../requests/requests.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MerchantFiltersClientQuery } from './dto/merchant-filter-client.dto';

@Resolver('')
export class DashboardResolver {
  constructor(
    private readonly clientService: ClientService,
    private readonly ownerService: OwnerService,
    private readonly orderService: DashboardOrderService,
    private readonly requestsService: RequestsService,
  ) {}

  @Query('dashboardFindAllClients')
  async getClients(@Args('filters') filters: ClientFiltersQuery) {
    return this.clientService.getForDashboard(filters);
  }

  @Permissions(MerchantPermissions.ALL_PERMISSION.value, MerchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('merchantFindAllClients')
  async getClientsForMerchant(@Args('filters') filters: MerchantFiltersClientQuery) {
    return this.clientService.getClientsForMerchant(filters);
  }

  @Query('dashboardFindAllOwners')
  async getOwners(@Args('filters') filters: OwnerFiltersQuery) {
    return this.ownerService.getForDashboard(filters);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('dashboardFindOneClientOrOwnerDetails')
  async getClientDetailsById(
    @Args('client_owner_id') client_owner_id: string,
    @Args('client_owner_type') client_owner_type: ClientOwnerTypesDetailsEnum,
  ) {
    const client_owner =
      client_owner_type && client_owner_type === ClientOwnerTypesDetailsEnum.CLIENT
        ? (await this.clientService.getClientDetailsById(client_owner_id))?.[0] || {}
        : client_owner_type && client_owner_type === ClientOwnerTypesDetailsEnum.OWNER
        ? (await this.ownerService.getOwnerDetailsById(client_owner_id))?.[0] || {}
        : {};
    return client_owner;
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('dashboardUpdateClient')
  async updateclient(
    @Args('id') id: string,
    @Args('adminUpdateClientDto') adminUpdateClientDto: AdminUpdateClientDto,
    @CurrentUser() user: any,
  ) {
    const client = await this.clientService.adminUpdateClient(id, adminUpdateClientDto, user);
    return client;
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('dashboardUpdateOwner')
  async updateOwner(@Args('id') id: string, @Args('adminUpdateOwnerDto') adminUpdateOwnerDto: AdminUpdateOwnerDto) {
    const owner = await this.ownerService.adminUpdateOwner(id, adminUpdateOwnerDto);
    return owner;
  }

  @Query('dashboardFindOwnerByMobileOrEmail')
  getByMobileOrEmail(@Args('query') query: 'email' | 'mobile') {
    return this.ownerService.getByMobileOrEmail(query);
  }

  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  @Query('dashboardClientOrderingHisoryForMerchant')
  clientOrderingHistory(@Args('merchantId', ValidateMongoId) merchantId: string, @Args('query') query: GetAllDto) {
    return this.orderService.clientOrderingHistory(merchantId, query);
  }

  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  @Query('dashboardOperationFindAllOrders')
  orders(@Args('query') query: DashboardOrderQueryDto) {
    return this.orderService.findAll(query);
  }

  @Query('dashboardFindAllRequests')
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  findAllRequests(@Args('query') query: ReviewQuery) {
    return this.requestsService.findAllRequests(query);
  }

  @Query('dashboardFindOneRequest')
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  getUpdateRequestByID(@Args('referenceId') referenceId: string) {
    return this.requestsService.findOne(referenceId);
  }
}
