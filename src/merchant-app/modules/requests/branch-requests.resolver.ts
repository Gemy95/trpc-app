import { PermissionsGuard } from '../common/guards/permission.guard';
import branchPermissions from '../common/permissions/branch.permissions';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { UseGuards } from '@nestjs/common';
import { BranchApproveOrRejectDto } from './dto/branch-approve-or-reject.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchRequestsService } from './branch-requests.service';
import { BRANCH_REQUEST_TYPES } from '../common/constants/branch.constants';

@Resolver('')
export class BranchRequestsResolver {
  constructor(private readonly branchRequestsService: BranchRequestsService) {}

  @Mutation('createBranchRequest')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Args('branchId') branchId: string,
    @Args('branchRequestType') branchRequestType: BRANCH_REQUEST_TYPES,
    @Args('updateBranchDto') updateBranchDto: UpdateBranchDto,
    @CurrentUser() user: any,
  ) {
    return this.branchRequestsService.create(branchId, branchRequestType, updateBranchDto, user);
  }

  @Mutation('createPublishBranchesRequests')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  createPublishBranchesRequests(@Args('branchesIds') branchesIds: string[], @CurrentUser() user: any) {
    return this.branchRequestsService.createPublishBranchesRequests(branchesIds, user);
  }

  @Mutation('updateBranchRequest')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Args('requestId') requestId: string,
    @Args('branchId') branchId: string,
    @Args('branchRequestType') branchRequestType: BRANCH_REQUEST_TYPES,
    @Args('updateBranchDto') updateBranchDto: UpdateBranchDto,
    @CurrentUser() user: any,
  ) {
    return this.branchRequestsService.update(requestId, branchId, branchRequestType, updateBranchDto, user);
  }

  @Query('findOneBranchRequest')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  findOne(@Args('branchId') branchId: string, @Args('branchRequestType') branchRequestType: BRANCH_REQUEST_TYPES) {
    return this.branchRequestsService.findOne(branchId, branchRequestType);
  }

  @Mutation('approveOrRejectBranchRequest')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  approveOrReject(
    @CurrentUser() user: any,
    @Args('branchId') branchId: string,
    @Args('branchRequestType') branchRequestType: BRANCH_REQUEST_TYPES,
    @Args('changeStatusDto') changeStatusDto: BranchApproveOrRejectDto,
  ) {
    return this.branchRequestsService.approveOrReject(user, branchId, branchRequestType, changeStatusDto);
  }

  @Mutation('cancelBranchRequest')
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.DELETE_PERMISSION.value)
  remove(@Args('requestId') requestId: string, @Args('branchRequestType') branchRequestType: BRANCH_REQUEST_TYPES) {
    return this.branchRequestsService.remove(requestId, branchRequestType);
  }
}
