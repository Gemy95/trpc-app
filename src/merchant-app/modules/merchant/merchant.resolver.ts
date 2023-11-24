import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MERCHANT_USERS_TYPES } from '../common/constants/users.types';
import { Public } from '../common/decorators';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { FindAllMerchantType } from '../common/types/merchant.types';
import { Owner } from '../models';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { LinkVisitDto } from './dto/link-visit.dto';
import { MerchantQueryDto } from './dto/merchant-query.input';
import { FindMerchantStatisticsDto } from './dto/merchant-statistics.dto';
import { OnlineOrOfflineMerchantDto } from './dto/online-or-offline.dto';
import { ReApplyDto } from './dto/re-apply';
import { UpdateMerchantByShoppexEmployeeDto } from './dto/update-merchant-by-shoppex-employee.dto';
import { UpdateSocialMediaDto } from './dto/update-merchant-social-media.dto';
import { UpdateMerchantStatusByMerchantEmployeeOrOwnerDto } from './dto/update-merchant-status-by-merchant-employee-or-owner.dto';
import { MerchantService } from './merchant.service';

@Resolver('')
export class MerchantResolver {
  constructor(private readonly merchantService: MerchantService) {}

  @Mutation('createMerchant')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Args('createMerchantDto') createMerchantDto: CreateMerchantDto, @CurrentUser() user: any) {
    return this.merchantService.create(createMerchantDto, user);
  }

  @Query('findAllMerchants')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Args('query') query: MerchantQueryDto): Promise<FindAllMerchantType> {
    return this.merchantService.findAll(query);
  }

  @Query('findOneMerchant')
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  findOne(@Args('merchantId', ValidateMongoId) merchantId: string) {
    return this.merchantService.findOne(merchantId);
  }

  @Query('merchantAccountDetails')
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantDetailsById(@Args('merchantId', ValidateMongoId) merchantId: string) {
    return this.merchantService.getMerchantDetailsById(merchantId);
  }

  @Query('ownerMerchantAccount')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  getOwnerMerchantAccount(@CurrentUser() user) {
    return this.merchantService.getOwnerMerchantAccount(user);
  }

  @Query('merchantStatistics')
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantsById(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('findMerchantStatisticsDto') findMerchantStatisticsDto: FindMerchantStatisticsDto,
  ) {
    return this.merchantService.getMerchantStatisticsById(merchantId, findMerchantStatisticsDto);
  }

  @Mutation('updateMerchantSocialMedia')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateSocialMedia(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('updateSocialMediaDto') updateSocialMediaDto: UpdateSocialMediaDto,
  ) {
    return this.merchantService.updateSocialMedia(merchantId, updateSocialMediaDto);
  }

  @Mutation('merchantReApply')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reApply(@Args('reApplyDto') reApplyDto: ReApplyDto) {
    return this.merchantService.reApply(reApplyDto);
  }

  @Mutation('merchantOnlineOrOffline')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  onlineOrOffline(@CurrentUser() user, @Args('onlineOrOfflineDto') onlineOrOfflineDto: OnlineOrOfflineMerchantDto) {
    if (MERCHANT_USERS_TYPES.includes(user.type)) {
      onlineOrOfflineDto.merchantId = user.merchantId;
    }
    if (user.type === Owner.name) {
      onlineOrOfflineDto.ownerId = user._id;
    }

    return this.merchantService.onlineOffline(onlineOrOfflineDto);
  }
  // @Permissions(
  //   merchantEmployeePermissions.ALL_PERMISSION.value,
  //   merchantEmployeePermissions.UPDATE_PERMISSION.value,
  // )
  // need owner or merchant employee permissions
  @Mutation('merchantEmployeeOrOwnerUpdateStatus')
  async updateMerchantStatusByOwnerOrMerchantEmployee(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('updateMerchantStatusByMerchantEmployeeOrOwnerDto')
    updateMerchantStatusByMerchantEmployeeOrOwnerDto: UpdateMerchantStatusByMerchantEmployeeOrOwnerDto,
    @CurrentUser() user: any,
  ) {
    const merchant = await this.merchantService.updateMerchantStatusByOwnerOrMerchantEmployee(
      merchantId,
      updateMerchantStatusByMerchantEmployeeOrOwnerDto,
      user,
    );
    return merchant;
  }

  @Mutation('shoppexEmployeeUpdateMerchant')
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateByShoppexEmployee(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('updateMerchantByShoppexEmployeeDto')
    updateMerchantByShoppexEmployeeDto: UpdateMerchantByShoppexEmployeeDto,
  ) {
    return this.merchantService.updateByShoppexEmployee(merchantId, updateMerchantByShoppexEmployeeDto);
  }

  @Public()
  @Mutation('merchantLinkVisits')
  linkVisits(@Args('id', ValidateMongoId) id: string, @Args('type') type: LinkVisitDto) {
    return this.merchantService.linkVisits(id, type);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @Mutation('merchantPublish')
  async publishMerchant(@Args('id') id: string) {
    return this.merchantService.publishMerchant(id);
  }

  @Mutation('updateMerchantLowestPriceToOrder')
  // @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  updateMerchantLowestPriceToOrder(@Args('lowestPriceToOrder') lowestPriceToOrder: number, @CurrentUser() user) {
    return this.merchantService.updateMerchantLowestPriceToOrder(lowestPriceToOrder, user);
  }

  @Mutation('updateMerchantMinimumDeliveryPrice')
  // @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  updateMerchantMinimumDeliveryPrice(
    @Args('minimum_delivery_price') minimum_delivery_price: number,
    @CurrentUser() user,
  ) {
    return this.merchantService.updateMerchantMinimumDeliveryPrice(minimum_delivery_price, user);
  }
}
