import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import BranchGroupPermissions from '../common/permissions/branch-group.permissions';
import { BranchGroupService } from './branch-group.service';
import { CreateBranchGroupDto } from './dto/create-branch-group.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { UpdateBranchGroupDto } from './dto/update-branch-group.dto';
import { FindAllBranchGroupDto } from './dto/findAll-branch-group.dto';

@Resolver('/')
export class BranchGroupResolver {
  constructor(private readonly branchGroupService: BranchGroupService) {}

  // need update
  // @Permissions(BranchGroupPermissions.ALL_PERMISSION.value, BranchGroupPermissions.CREATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeCreateBranchGroup')
  create(@Args('createBranchGroupDto') createBranchGroupDto: CreateBranchGroupDto) {
    return this.branchGroupService.create(createBranchGroupDto);
  }

  // @Permissions(BranchGroupPermissions.ALL_PERMISSION.value, BranchGroupPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findAllBranchGroups')
  findAll(@Args('params') params: FindAllBranchGroupDto) {
    return this.branchGroupService.getAll(params);
  }

  // @Permissions(BranchGroupPermissions.ALL_PERMISSION.value, BranchGroupPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findOneBranchGroup')
  getOne(@Args('branchGroupId') branchGroupId: string) {
    return this.branchGroupService.getOne(branchGroupId);
  }

  // @Permissions(BranchGroupPermissions.ALL_PERMISSION.value, BranchGroupPermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateBranchGroup')
  update(
    @Args('branchGroupId') branchGroupId: string,
    @Args('updateBranchGroupDto') updateBranchGroupDto: UpdateBranchGroupDto,
  ) {
    return this.branchGroupService.updateOne(branchGroupId, updateBranchGroupDto);
  }

  // @Permissions(BranchGroupPermissions.ALL_PERMISSION.value, BranchGroupPermissions.DELETE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDeleteBranchGroup')
  deleteOne(@Args('branchGroupId') branchGroupId: string) {
    return this.branchGroupService.deleteOne(branchGroupId);
  }
}
