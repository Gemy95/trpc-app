import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MERCHANT_USERS_TYPES } from '../common/constants/users.types';
import { Public } from '../common/decorators';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { FindMerchantStatisticsDto } from './dto/merchant-statistics.dto';
import { DashboardMerchantService } from './dashboard-merchant.service';
import { FindDashboardMerchantsStatisticsDto } from './dto/dashboard-merchant-statistics.dto';

@Resolver('')
export class DashboardMerchantResolver {
  constructor(private readonly dashboardMerchantService: DashboardMerchantService) {}

  @Query('dashboardMerchantsStatistics')
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getDashboardMerchantsStatistics(
    @Args('findDashboardMerchantsStatisticsDto')
    findDashboardMerchantsStatisticsDto: FindDashboardMerchantsStatisticsDto,
  ) {
    return this.dashboardMerchantService.getDashboardMerchantsStatistics(findDashboardMerchantsStatisticsDto);
  }
}
