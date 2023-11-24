import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import { DashboardPermissionService } from './dashboard-permission.service';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import ShoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import MerchantEmployeePermissions from '../common/permissions/merchant-employee.permissions';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MERCHANT_EMPLOYEE_JOB } from '../common/constants/merchant-employee';

@Resolver('/')
export class DashboardPermissionResolver {
  constructor(private readonly dashboardPermissionService: DashboardPermissionService) {}

  @Permissions(ShoppexEmployeePermissions.ALL_PERMISSION.value, ShoppexEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('dashboardGetShoppexEmployeePermissions')
  getAllPermissionsForShoppexEmployee() {
    return this.dashboardPermissionService.getAllPermissionsForShoppexEmployee();
  }

  @Permissions(MerchantEmployeePermissions.ALL_PERMISSION.value, MerchantEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('dashboardGetMerchantEmployeePermissions')
  getAllPermissionsForMerchantEmployee(@CurrentUser() user: any) {
    return this.dashboardPermissionService.getAllPermissionsForMerchantEmployee();
  }
}
