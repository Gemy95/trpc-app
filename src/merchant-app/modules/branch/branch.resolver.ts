import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { Permissions } from '../common/decorators';
import { BaseQuery } from '../common/dto/BaseQuery.dto';
import { PermissionsGuard } from '../common/guards';
import branchPermissions from '../common/permissions/branch.permissions';
import merchantEmployeePermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { BranchService } from './branch.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindAllBranchDto } from './dto/find-all-filter.dto';
import { UpdateBranchStatusByMerchantEmployeeOrOwnerDto } from './dto/update-branch-status-by-merchant-employee-or-owner.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchByShoppexEmployeeDto } from './dto/update-branch-by-shoppex-employee.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
@Resolver('')
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  @Mutation('createBranch')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @CurrentUser() user: any,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('createBranchDto') createBranchDto: CreateBranchDto,
  ) {
    return this.branchService.create(user, merchantId, createBranchDto);
  }

  @Query('findAllBranches')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @CurrentUser() user: any,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('query') query: FindAllBranchDto,
  ) {
    return this.branchService.findAll(merchantId, query, user);
  }

  @Query('branchDetails')
  @Permissions(
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
    branchPermissions.ALL_PERMISSION.value,
    branchPermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  findOne(
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.getBranchDetails(branchId, merchantId);
  }

  @Mutation('removeBranch')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Args('branchId', ValidateMongoId) branchId: string, @Args('merchantId', ValidateMongoId) merchantId: string) {
    return this.branchService.remove(branchId, merchantId);
  }

  @Mutation('reApplyBranch')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reApply(
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.reApply(branchId, merchantId);
  }

  @Mutation('freezingBranch')
  @Permissions(branchPermissions.ALL_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  freezing(
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.branchService.freezing(branchId, merchantId);
  }

  @Mutation('onlineOrOfflineBranch')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  onlineOrOffline(
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('changeStatusDto') changeStatusDto: ChangeStatusDto,
  ) {
    return this.branchService.onlineOrOffline(merchantId, branchId, changeStatusDto);
  }

  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateBranch')
  updateByShoppexEmployee(
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('updateBranchDto') updateBranchDto: UpdateBranchByShoppexEmployeeDto,
  ) {
    return this.branchService.updateByShoppexEmployee(branchId, updateBranchDto);
  }

  @Permissions(merchantEmployeePermissions.ALL_PERMISSION.value, merchantEmployeePermissions.UPDATE_PERMISSION.value)
  @Mutation('merchantEmployeeOrOwnerUpdateBranchstatus')
  async updateBranchStatusByOwnerOrMerchantEmployee(
    @CurrentUser() user: any,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('branchId', ValidateMongoId) branchId: string,
    @Args('updateBranchStatusByMerchantEmployeeOrOwnerDto')
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
  @Mutation('updateBranch')
  updateBranch(@Args('id', ValidateMongoId) id: string, @Args('updateBranchDto') updateBranchDto: UpdateBranchDto) {
    return this.branchService.updateBranch(id, updateBranchDto);
  }

  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @Mutation('publishBranch')
  async publishBranch(@Args('id', ValidateMongoId) id: string) {
    return this.branchService.publishBranch(id);
  }

  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @Mutation('startBranchSubscription')
  async startBranchSubscription(@Args('id', ValidateMongoId) id: string) {
    return this.branchService.startBranchSubscription(id);
  }
}
