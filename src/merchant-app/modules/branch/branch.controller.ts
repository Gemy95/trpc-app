import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions } from '../common/decorators';
import { BaseQuery } from '../common/dto/BaseQuery.dto';
import { PermissionsGuard } from '../common/guards';
import branchPermissions from '../common/permissions/branch.permissions';
import merchantEmployeePermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { BranchService } from './branch.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindAllBranchDto } from './dto/find-all-filter.dto';
import { UpdateBranchByShoppexEmployeeDto } from './dto/update-branch-by-shoppex-employee.dto';
import { UpdateBranchStatusByMerchantEmployeeOrOwnerDto } from './dto/update-branch-status-by-merchant-employee-or-owner.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('dashboard/:merchantId/branches')
@ApiTags(swaggerResources.Branch)
@ApiBearerAuth()
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiResponse({ description: 'This for creating branch', status: 201 })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @CurrentUser() user: any,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    return this.branchService.create(user, merchantId, createBranchDto);
  }

  @Get()
  @ApiResponse({ description: 'This for getting branches', status: 200 })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @CurrentUser() user: any,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query() query: FindAllBranchDto,
  ) {
    return this.branchService.findAll(merchantId, query, user);
  }

  @Get(':branchId')
  @ApiResponse({
    description: 'This for getting one branch by id',
    status: 200,
  })
  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    branchPermissions.ALL_PERMISSION.value,
    branchPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  findOne(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.getBranchDetails(branchId, merchantId);
  }

  @Delete(':branchId')
  @ApiResponse({
    description: 'This to delete branch by its id',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.remove(branchId, merchantId);
  }

  @Patch(':branch/re-apply')
  @ApiResponse({
    description: 'This to reapply ',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reApply(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.reApply(branchId, merchantId);
  }

  @Patch(':branchId/freezing')
  @ApiResponse({
    description: 'This to freezing',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  freezing(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.freezing(branchId, merchantId);
  }

  @Patch(':branchId/online-or-offline')
  @ApiResponse({
    description: 'This to online or offline',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  onlineOrOffline(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.branchService.onlineOrOffline(merchantId, branchId, changeStatusDto);
  }

  @ApiResponse({
    description: 'Used to update branch by shoppex employee',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('shoppex-employee/update/:branchId')
  updateByShoppexEmployee(
    @Param('branchId', ValidateMongoId) branchId: string,
    @Body() updateBranchDto: UpdateBranchByShoppexEmployeeDto,
  ) {
    return this.branchService.updateByShoppexEmployee(branchId, updateBranchDto);
  }

  @Permissions(merchantEmployeePermissions.ALL_PERMISSION.value, merchantEmployeePermissions.UPDATE_PERMISSION.value)
  @ApiBearerAuth()
  @Patch('/merchant-employee-or-owner/update/:branchId/status')
  async updateBranchStatusByOwnerOrMerchantEmployee(
    @CurrentUser() user: any,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('branchId', ValidateMongoId) branchId: string,
    @Body()
    updateBranchStatusByMerchantEmployeeOrOwnerDto: UpdateBranchStatusByMerchantEmployeeOrOwnerDto,
  ) {
    const branch = await this.branchService.updateBranchStatusByOwnerOrMerchantEmployee(
      user,
      branchId,
      merchantId,
      updateBranchStatusByMerchantEmployeeOrOwnerDto,
    );
    return branch;
  }

  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @ApiBearerAuth()
  @Patch(':id')
  updateBranch(@Param('id', ValidateMongoId) id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.updateBranch(id, updateBranchDto);
  }

  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @ApiBearerAuth()
  @Patch(':id/publish')
  async publishBranch(@Param('id', ValidateMongoId) id: string) {
    return this.branchService.publishBranch(id);
  }
}
