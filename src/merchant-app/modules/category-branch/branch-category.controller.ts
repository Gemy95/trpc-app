import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BranchCategoryService } from './branch-category.service';
import { CreateBranchCategoryDto } from './dto/create-branch-category.dto';
import { UpdateBranchCategoryDto } from './dto/update-branch-category.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import branchCategoryPermissions from '../common/permissions/branch-category.permissions';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllDto } from '../common/dto/get-all.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';

@Controller('branch-categories')
@ApiTags(swaggerResources.BranchCategory)
export class BranchCategoryController {
  constructor(private readonly branchCategoryService: BranchCategoryService) {}

  @Post()
  @ApiResponse({
    description: 'This for creating category for branch',
    status: 201,
  })
  @Permissions(branchCategoryPermissions.ALL_PERMISSION.value, branchCategoryPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Body() createBranchCategoryDto: CreateBranchCategoryDto) {
    return this.branchCategoryService.create(createBranchCategoryDto);
  }

  @Get('/:branchId/categories')
  @ApiResponse({
    description: 'This for creating categories of branch',
    status: 200,
  })
  // @Permissions(branchCategoryPermissions.ALL_PERMISSION.value, branchCategoryPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  async find(@Param('branchId') branchId: string, @Query() query: GetAllDto) {
    return this.branchCategoryService.findAll(branchId, query);
  }

  @Get(':id')
  @ApiResponse({
    description: 'This for getting one category of branch',
    status: 201,
  })
  // @Permissions(branchCategoryPermissions.ALL_PERMISSION.value, branchCategoryPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  findOne(@Param('id') id: string) {
    return this.branchCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    description: 'This for updating categories of branch',
    status: 200,
  })
  @Permissions(branchCategoryPermissions.ALL_PERMISSION.value, branchCategoryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(@Param('id') id: string, @Body() updateBranchCategoryDto: UpdateBranchCategoryDto) {
    return this.branchCategoryService.update(id, updateBranchCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({
    description: 'This for deleting category of branch',
    status: 200,
  })
  @Permissions(branchCategoryPermissions.ALL_PERMISSION.value, branchCategoryPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Param('id') id: string) {
    return this.branchCategoryService.remove(id);
  }
}
