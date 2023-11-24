import { forwardRef, Module } from '@nestjs/common';

import { DashboardPermissionResolver } from './dashboard-permission.resolver';
import { DashboardPermissionService } from './dashboard-permission.service';

@Module({
  imports: [],
  providers: [DashboardPermissionResolver, DashboardPermissionService],
  exports: [DashboardPermissionResolver, DashboardPermissionService],
})
export class PermissionModule {}
