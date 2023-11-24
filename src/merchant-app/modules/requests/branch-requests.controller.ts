import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { BRANCH_REQUEST_TYPES } from '../common/constants/branch.constants';
import branchPermissions from '../common/permissions/branch.permissions';
import { BranchRequestsService } from './branch-requests.service';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchApproveOrRejectDto } from './dto/branch-approve-or-reject.dto';

@Controller('requests/branches')
@ApiTags(swaggerResources.Requests)
@ApiBearerAuth()
export class BranchRequestsController {
  constructor(private readonly branchRequestsService: BranchRequestsService) {}

  @Post('/:branchId/')
  @ApiQuery({
    name: 'branchRequestType',
    required: true,
    enum: BRANCH_REQUEST_TYPES,
    example: BRANCH_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Update branch by Id',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Param('branchId') branchId: string,
    @Query('branchRequestType', new DefaultValuePipe(BRANCH_REQUEST_TYPES)) branchRequestType: BRANCH_REQUEST_TYPES,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() user: any,
  ) {
    return this.branchRequestsService.create(branchId, branchRequestType, updateBranchDto, user);
  }

  @Get('/:branchId/')
  @ApiQuery({
    name: 'branchRequestType',
    required: true,
    enum: BRANCH_REQUEST_TYPES,
    example: BRANCH_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Fetch update request by branch Id',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  findOne(
    @Param('branchId') branchId: string,
    @Query('branchRequestType', new DefaultValuePipe(BRANCH_REQUEST_TYPES.DATA))
    branchRequestType: BRANCH_REQUEST_TYPES,
  ) {
    return this.branchRequestsService.findOne(branchId, branchRequestType);
  }

  @Patch('/:branchId/:requestId')
  @ApiQuery({
    name: 'branchRequestType',
    required: true,
    enum: BRANCH_REQUEST_TYPES,
    example: BRANCH_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Update branch by Id',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Param('branchId') branchId: string,
    @Param('requestId') requestId: string,
    @Query('branchRequestType', new DefaultValuePipe(BRANCH_REQUEST_TYPES.DATA))
    branchRequestType: BRANCH_REQUEST_TYPES,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() user: any,
  ) {
    return this.branchRequestsService.update(requestId, branchId, branchRequestType, updateBranchDto, user);
  }

  @Post('/approve-or-reject/:branchId/')
  @ApiQuery({
    name: 'branchRequestType',
    required: true,
    enum: BRANCH_REQUEST_TYPES,
    example: BRANCH_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'This for approving or rejecting branch',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  approveOrReject(
    @CurrentUser() user: any,
    @Param('branchId') branchId: string,
    @Query('branchRequestType', new DefaultValuePipe(BRANCH_REQUEST_TYPES.DATA))
    branchRequestType: BRANCH_REQUEST_TYPES,
    @Body() changeStatusDto: BranchApproveOrRejectDto,
  ) {
    return this.branchRequestsService.approveOrReject(user, branchId, branchRequestType, changeStatusDto);
  }

  @Delete('/cancel/:requestId')
  @ApiQuery({
    name: 'branchRequestType',
    required: true,
    enum: BRANCH_REQUEST_TYPES,
    example: BRANCH_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Delete update request',
    status: 200,
  })
  @Permissions(branchPermissions.ALL_PERMISSION.value, branchPermissions.DELETE_PERMISSION.value)
  remove(
    @Param('requestId') requestId: string,
    @Query('branchRequestType', new DefaultValuePipe(BRANCH_REQUEST_TYPES.DATA))
    branchRequestType: BRANCH_REQUEST_TYPES,
  ) {
    return this.branchRequestsService.remove(requestId, branchRequestType);
  }
}
