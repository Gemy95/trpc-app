import { Module } from '@nestjs/common';
import { BranchModule } from '../branch/branch.module';
import { MerchantModule } from '../merchant/merchant.module';
import { MenuUploadResolver } from './menu-upload.resolver';
import { MenuUploadService } from './menu-upload.service';
import { DashboardMenuUploadResolver } from './dashboard-menu-upload.resolver';
import { DashboardMenuUploadService } from './dashboard-menu-upload.service';

@Module({
  imports: [MerchantModule, BranchModule],
  providers: [MenuUploadService, MenuUploadResolver, DashboardMenuUploadResolver, DashboardMenuUploadService],
})
export class MenuUploadModule {}
