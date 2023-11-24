import { PermissionsGuard } from '../common/guards/permission.guard';
import merchantPermissions from '../common/permissions/merchant.permissions';
import { MerchantRequestsService } from './merchant-requests.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { MerchantApproveOrRejectDto } from './dto/merchant-approve-or-reject.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { UseGuards } from '@nestjs/common';
import { MERCHANT_REQUEST_TYPES } from '../common/constants/merchant';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Resolver('')
export class MerchantRequestsResolver {
  constructor(private readonly merchantRequestsService: MerchantRequestsService) {}

  @Mutation('createMerchantRequest')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('merchantRequestType') merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Args('updateMerchantDto') updateMerchantDto: UpdateMerchantDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantRequestsService.create(merchantId, merchantRequestType, updateMerchantDto, user);
  }

  @Query('findOneMerchantRequest')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  findOne(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('merchantRequestType') merchantRequestType: MERCHANT_REQUEST_TYPES,
  ) {
    return this.merchantRequestsService.findOne(merchantId, merchantRequestType);
  }

  @Mutation('updateMerchantRequest')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('requestId', ValidateMongoId) requestId: string,
    @Args('merchantRequestType') merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Args('updateMerchantDto') updateMerchantDto: UpdateMerchantDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantRequestsService.update(requestId, merchantId, merchantRequestType, updateMerchantDto, user);
  }

  @Mutation('approveOrRejectMerchantRequest')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  approveOrReject(
    @CurrentUser() user: any,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('merchantRequestType') merchantRequestType: MERCHANT_REQUEST_TYPES,
    @Args('changeStatusDto') changeStatusDto: MerchantApproveOrRejectDto,
  ) {
    return this.merchantRequestsService.approveOrReject(user, merchantId, merchantRequestType, changeStatusDto);
  }

  @Mutation('cancelMerchantRequest')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.DELETE_PERMISSION.value)
  remove(
    @Args('requestId') requestId: string,
    @Args('merchantRequestType') merchantRequestType: MERCHANT_REQUEST_TYPES,
  ) {
    return this.merchantRequestsService.remove(requestId, merchantRequestType);
  }
}
