import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BranchModule } from '../branch/branch.module';
import { Table, TableRepository, TableSchema } from '../models';
import { DashboardTableController } from './dashboard-table.controller';
import { DashboardTableResolver } from './dashboard-table.resolver';
import { DashboardTableService } from './dashboard-table.service';
import { MarketplaceTableController } from './marketplace-table.controller';
import { MarketplaceTableService } from './marketplace-table.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]), forwardRef(() => BranchModule)],
  controllers: [DashboardTableController, MarketplaceTableController],
  providers: [DashboardTableService, TableRepository, DashboardTableResolver, MarketplaceTableService],
  exports: [DashboardTableService, TableRepository, DashboardTableResolver, MarketplaceTableService],
})
export class TableModule {}
