import { UseGuards } from '@nestjs/common';
import { DashboardTableService } from './dashboard-table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { GetTablesDto } from './dto/get-tables.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import TablePermissions from '../common/permissions/tag.permissions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateTableDto } from './dto/update-table.dto';
import { GetAvailableTablesDto } from './dto/get-available-tables.dto';

@Resolver()
export class DashboardTableResolver {
  constructor(private readonly dashboardTableService: DashboardTableService) {}

  @Mutation('dashboardCreateTable')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Args('createTableDto') createTableDto: CreateTableDto) {
    return this.dashboardTableService.create(createTableDto);
  }

  @Query('dashboardFindAllTables')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Args('getTablesDto') getTablesDto: GetTablesDto) {
    return this.dashboardTableService.findAll(getTablesDto);
  }

  @Query('dashboardFindAllAvailableTables')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAllAvailable(@Args('getAvailableTablesDto') getAvailableTablesDto: GetAvailableTablesDto) {
    return this.dashboardTableService.findAllAvailable(getAvailableTablesDto);
  }

  @Query('dashboardFindOneTable')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(@Args('tableId') tableId: string, @Args('branchId') branchId: string) {
    return this.dashboardTableService.findOne(tableId, branchId);
  }

  @Mutation('dashboardDeleteTable')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Args('tableId') tableId: string, @Args('branchId') branchId: string) {
    return this.dashboardTableService.remove(tableId, branchId);
  }

  @Mutation('dashboardUpdateOneTable')
  @Permissions(TablePermissions.ALL_PERMISSION.value, TablePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateOne(
    @Args('tableId') tableId: string,
    @Args('branchId') branchId: string,
    @Args('updateTableDto') updateTableDto: UpdateTableDto,
  ) {
    return this.dashboardTableService.updateOne(tableId, branchId, updateTableDto);
  }
}
