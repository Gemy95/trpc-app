import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTablesDto } from './dto/get-tables.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import tablePermissions from '../common/permissions/tag.permissions';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { MarketplaceTableService } from './marketplace-table.service';
import { Public } from '../common/decorators';

@Controller('marketplace/tables')
@ApiTags(swaggerResources.MarketplaceTables)
export class MarketplaceTableController {
  constructor(private readonly marketplaceTableService: MarketplaceTableService) {}

  @Public()
  @Get()
  @ApiResponse({ description: 'This for getting tables', status: 200 })
  // @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  findAll(@Query() getTablesDto: GetTablesDto) {
    return this.marketplaceTableService.findAll(getTablesDto);
  }

  @Public()
  @Get(':tableId/:branchId')
  @ApiResponse({ description: 'This for getting one table', status: 200 })
  // @Permissions(tablePermissions.ALL_PERMISSION.value, tablePermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  findOne(@Param('tableId') tableId: string, @Param('branchId') branchId: string) {
    return this.marketplaceTableService.findOne(tableId, branchId);
  }
}
