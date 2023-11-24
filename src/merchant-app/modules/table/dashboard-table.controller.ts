import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardTableService } from './dashboard-table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { GetTablesDto } from './dto/get-tables.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import tablePermissions from '../common/permissions/tag.permissions';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('dashboard/tables')
@ApiTags(swaggerResources.DashboardTables)
@ApiBearerAuth()
export class DashboardTableController {
  constructor(private readonly dashboardTableService: DashboardTableService) {}

  @Post()
  @ApiResponse({ description: 'This for creating table', status: 201 })
  @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Body() createTableDto: CreateTableDto) {
    return this.dashboardTableService.create(createTableDto);
  }

  @Get()
  @ApiResponse({ description: 'This for getting tables', status: 200 })
  @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Query() getTablesDto: GetTablesDto) {
    return this.dashboardTableService.findAll(getTablesDto);
  }

  @Get(':tableId/:branchId')
  @ApiResponse({ description: 'This for getting one table', status: 200 })
  @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(@Param('tableId') tableId: string, @Param('branchId') branchId: string) {
    return this.dashboardTableService.findOne(tableId, branchId);
  }

  @Delete(':tableId/:branchId')
  @ApiResponse({ description: 'This for deleting one table', status: 204 })
  @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Param('tableId') tableId: string, @Param('branchId') branchId: string) {
    return this.dashboardTableService.remove(tableId, branchId);
  }

  @Patch(':tableId/:branchId')
  @ApiResponse({ description: 'This for updating one table', status: 204 })
  @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateOne(
    @Param('tableId') tableId: string,
    @Param('branchId') branchId: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.dashboardTableService.updateOne(tableId, branchId, updateTableDto);
  }
}
