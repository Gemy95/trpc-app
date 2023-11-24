import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { MERCHANT_USERS_TYPES } from '../common/constants/users.types';
import { Public } from '../common/decorators';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { FindAllMerchantType } from '../common/types/merchant.types';
import { Owner } from '../models';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { LinkVisitDto } from './dto/link-visit.dto';
import { MerchantQueryDto } from './dto/merchant-query.dto';
import { FindMerchantStatisticsDto } from './dto/merchant-statistics.dto';
import { OnlineOrOfflineMerchantDto } from './dto/online-or-offline.dto';
import { ReApplyDto } from './dto/re-apply';
import { UpdateMerchantByShoppexEmployeeDto } from './dto/update-merchant-by-shoppex-employee.dto';
import { UpdateSocialMediaDto } from './dto/update-merchant-social-media.dto';
import { UpdateMerchantStatusByMerchantEmployeeOrOwnerDto } from './dto/update-merchant-status-by-merchant-employee-or-owner.dto';
import { MerchantService } from './merchant.service';

@Controller('merchants')
@ApiBearerAuth()
@ApiTags(swaggerResources.Merchant)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  @ApiResponse({ description: 'This for creating merchant', status: 201 })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Body() createMerchantDto: CreateMerchantDto, @CurrentUser() user: any) {
    return this.merchantService.create(createMerchantDto, user);
  }

  @Get()
  @ApiResponse({ description: 'This for getting merchants', status: 200 })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Query() query: MerchantQueryDto): Promise<FindAllMerchantType> {
    return this.merchantService.findAll(query);
  }

  @Get('/:merchantId')
  @ApiResponse({
    description: 'Get merchant by merchant ID',
    status: 200,
  })
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  findOne(@Param('merchantId') merchantId: string) {
    return this.merchantService.findOne(merchantId);
  }

  @Get('/merchant-account/:merchantId/details')
  @ApiResponse({
    description: 'Get merchant details by merchant ID',
    status: 200,
  })
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantDetailsById(@Param('merchantId') merchantId: string) {
    return this.merchantService.getMerchantDetailsById(merchantId);
  }

  @Get('/owner/merchant-account')
  @ApiResponse({
    description: 'Get merchant for owner account by owner ID',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  getOwnerMerchantAccount(@CurrentUser() user) {
    return this.merchantService.getOwnerMerchantAccount(user);
  }

  @Get('statistics/:merchantId')
  @ApiResponse({
    description: 'Get merchants by owner ID',
    status: 200,
  })
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantsById(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() findMerchantStatisticsDto: FindMerchantStatisticsDto,
  ) {
    return this.merchantService.getMerchantStatisticsById(merchantId, findMerchantStatisticsDto);
  }

  @Patch('social-media/:merchantId')
  @ApiResponse({
    description: 'This return the updated social media for merchant',
    status: 204,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateSocialMedia(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
  ) {
    return this.merchantService.updateSocialMedia(merchantId, updateSocialMediaDto);
  }

  @Patch('/re-apply')
  @ApiResponse({
    description: 'This for reapplying merchant',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reApply(@Body() reApplyDto: ReApplyDto) {
    return this.merchantService.reApply(reApplyDto);
  }

  @Patch('/online-or-offline')
  @ApiResponse({
    description: 'This for offline or online merchant',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  onlineOrOffline(@CurrentUser() user, @Body() onlineOrOfflineDto: OnlineOrOfflineMerchantDto) {
    if (MERCHANT_USERS_TYPES.includes(user.type)) {
      onlineOrOfflineDto.merchantId = user.merchantId;
    }
    if (user.type === Owner.name) {
      onlineOrOfflineDto.ownerId = user._id;
    }

    return this.merchantService.onlineOffline(onlineOrOfflineDto);
  }
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('/merchant-employee-or-owner/update/:merchantId/status')
  async updateMerchantStatusByOwnerOrMerchantEmployee(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body()
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

  @Patch('/shoppex-employee/update/:merchantId')
  @ApiResponse({
    description: 'This for update one merchant',
    status: 200,
  })
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateByShoppexEmployee(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body()
    updateMerchantByShoppexEmployeeDto: UpdateMerchantByShoppexEmployeeDto,
  ) {
    return this.merchantService.updateByShoppexEmployee(merchantId, updateMerchantByShoppexEmployeeDto);
  }

  @Public()
  @Patch('/:id/link/visits')
  @ApiResponse({
    description: 'This for update one merchant',
    status: 200,
  })
  linkVisits(@Param('id', ValidateMongoId) id: string, @Body() type: LinkVisitDto) {
    return this.merchantService.linkVisits(id, type);
  }

  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Patch(':id/publish')
  async publishMerchant(@Param('id') id: string) {
    return this.merchantService.publishMerchant(id);
  }
}
