import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import merchantPermissions from '../common/permissions/merchant.permissions';
import { MerchantRequestsService } from './merchant-requests.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { MerchantApproveOrRejectDto } from './dto/merchant-approve-or-reject.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { MERCHANT_REQUEST_TYPES } from '../common/constants/merchant';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Controller('requests/merchants')
@ApiTags(swaggerResources.Requests)
@ApiBearerAuth()
export class MerchantRequestsController {
  constructor(private readonly merchantRequestsService: MerchantRequestsService) {}

  @Post('/:merchantId/')
  @ApiQuery({
    name: 'merchantRequestType',
    required: true,
    enum: MERCHANT_REQUEST_TYPES,
    example: MERCHANT_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Update merchant by Id',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query('merchantRequestType', new DefaultValuePipe(MERCHANT_REQUEST_TYPES))
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantRequestsService.create(merchantId, merchantRequestType, updateMerchantDto, user);
  }

  @Get('/:merchantId/')
  @ApiQuery({
    name: 'merchantRequestType',
    required: true,
    enum: MERCHANT_REQUEST_TYPES,
    example: MERCHANT_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Fetch update request by merchant Id',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  findOne(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query('merchantRequestType', new DefaultValuePipe(MERCHANT_REQUEST_TYPES.DATA))
    merchantRequestType: MERCHANT_REQUEST_TYPES,
  ) {
    return this.merchantRequestsService.findOne(merchantId, merchantRequestType);
  }

  @Patch('/:merchantId/:requestId')
  @ApiQuery({
    name: 'merchantRequestType',
    required: true,
    enum: MERCHANT_REQUEST_TYPES,
    example: MERCHANT_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Update merchant by Id',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('requestId') requestId: string,
    @Query('merchantRequestType', new DefaultValuePipe(MERCHANT_REQUEST_TYPES.DATA))
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantRequestsService.update(requestId, merchantId, merchantRequestType, updateMerchantDto, user);
  }

  @Post('/approve-or-reject/:merchantId/')
  @ApiQuery({
    name: 'merchantRequestType',
    required: true,
    enum: MERCHANT_REQUEST_TYPES,
    example: MERCHANT_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'This for approving or rejecting merchant',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  approveOrReject(
    @CurrentUser() user: any,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query('merchantRequestType', new DefaultValuePipe(MERCHANT_REQUEST_TYPES.DATA))
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Body() changeStatusDto: MerchantApproveOrRejectDto,
  ) {
    return this.merchantRequestsService.approveOrReject(user, merchantId, merchantRequestType, changeStatusDto);
  }

  @Delete('/cancel/:requestId')
  @ApiQuery({
    name: 'merchantRequestType',
    required: true,
    enum: MERCHANT_REQUEST_TYPES,
    example: MERCHANT_REQUEST_TYPES.DATA,
  })
  @ApiResponse({
    description: 'Delete update request',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.DELETE_PERMISSION.value)
  remove(
    @Param('requestId') requestId: string,
    @Query('merchantRequestType', new DefaultValuePipe(MERCHANT_REQUEST_TYPES.DATA))
    merchantRequestType: MERCHANT_REQUEST_TYPES,
  ) {
    return this.merchantRequestsService.remove(requestId, merchantRequestType);
  }
}
