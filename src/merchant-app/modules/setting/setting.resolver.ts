import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVerificationTypeSettingDto } from './dtos/create-verification-type-setting.dto';
import { UpdateDistanceDto } from './dtos/update-distance.dto';
import { SettingService } from './setting.service';
import { CreateBranchDistanceSettingDto } from './dtos/create-branch-distance-setting.dto';
import { CreateBranchGroupDistanceSettingDto } from './dtos/create-branch-group-distance-setting.dto';
import { CreateMarketplaceMerchantBranchesDistanceSettingDto } from './dtos/create-marketplace-merchant-branch-distance-setting.dto';
import { CreateMarketplaceLowestOrderPriceSettingDto } from './dtos/create-marketplace-lowest-order-price-setting.dto';
import { CreateMerchantLowestOrderPriceSettingDto } from './dtos/create-merchant-lowest-order-price-setting.dto';
import { CreateShoppexOrderTaxSettingDto } from './dtos/create-shoppex-order-tax-setting.dto';
import { CreateTimeAfterDeliveredOrderSettingDto } from './dtos/create-time-after-delivered-order-setting.dto';
import { SETTING_MODEL_NAME } from '../common/constants/setting.constants';

@Resolver('')
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Mutation('createBranchDistanceSetting')
  createBranchDistanceSetting(
    @Args('createBranchDistanceSettingDto') createBranchDistanceSettingDto: CreateBranchDistanceSettingDto,
  ) {
    return this.settingService.createBranchDistanceSetting(createBranchDistanceSettingDto);
  }

  @Query('findOneBranchDistanceSetting')
  findOneBranchDistanceSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_Branch);
  }

  @Mutation('createVerificationTypeSetting')
  createVerificationSetting(
    @Args('createVerificationTypeSettingDto') createVerificationTypeSettingDto: CreateVerificationTypeSettingDto,
  ) {
    return this.settingService.createVerificationTypeSetting(createVerificationTypeSettingDto);
  }

  @Query('findOneVerificationTypeSetting')
  findOneVerificationTypeSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_Verification);
  }

  @Mutation('createBranchGroupDistanceSetting')
  createBranchGroupDistanceSetting(
    @Args('createBranchGroupDistanceSettingDto')
    createBranchGroupDistanceSettingDto: CreateBranchGroupDistanceSettingDto,
  ) {
    return this.settingService.createBranchGroupDistanceSetting(createBranchGroupDistanceSettingDto);
  }

  @Query('findOneBranchGroupDistanceSetting')
  findOneBranchGroupDistanceSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_BranchGroup);
  }

  @Mutation('createMarketplaceMerchantBranchesDistanceSetting')
  createMarketplaceMerchantBranchesDistanceSetting(
    @Args('createBranchGroupDistanceSettingDto')
    createMarketplaceMerchantBranchesDistanceSettingDto: CreateMarketplaceMerchantBranchesDistanceSettingDto,
  ) {
    return this.settingService.createMarketplaceMerchantBranchesDistanceSetting(
      createMarketplaceMerchantBranchesDistanceSettingDto,
    );
  }

  @Query('findOneMarketplaceMerchantBranchesDistanceSetting')
  findOneMarketplaceMerchantBranchesDistanceSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_MarketplaceMerchantBranches);
  }

  @Mutation('createMarketplaceLowestOrderPriceSetting')
  createMarketplaceLowestOrderPriceSetting(
    @Args('createMarketplaceLowestOrderPriceSettingDto')
    createMarketplaceLowestOrderPriceSettingDto: CreateMarketplaceLowestOrderPriceSettingDto,
  ) {
    return this.settingService.createMarketplaceLowestOrderPriceSetting(createMarketplaceLowestOrderPriceSettingDto);
  }

  @Query('findOneMarketplaceLowestOrderPriceSetting')
  findOneMarketplaceLowestOrderPriceSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_LowestMarketplaceOrderPrice);
  }

  @Mutation('createMerchantLowestOrderPriceSetting')
  createMerchantLowestOrderPriceSetting(
    @Args('createMerchantLowestOrderPriceSettingDto')
    createMerchantLowestOrderPriceSettingDto: CreateMerchantLowestOrderPriceSettingDto,
  ) {
    return this.settingService.createMarketplaceLowestOrderPriceSetting(createMerchantLowestOrderPriceSettingDto);
  }

  @Query('findOneMerchantLowestOrderPriceSetting')
  findOneMerchantLowestOrderPriceSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_MerchantLowestPriceToOrder);
  }

  @Mutation('createShoppexOrderTaxSetting')
  createShoppexOrderTaxSetting(
    @Args('createShoppexOrderTaxSettingDto') createShoppexOrderTaxSettingDto: CreateShoppexOrderTaxSettingDto,
  ) {
    return this.settingService.createShoppexOrderTaxSetting(createShoppexOrderTaxSettingDto);
  }

  @Query('findOneShoppexOrderTaxSetting')
  findOneShoppexOrderTaxSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_ShoppexOrderTax);
  }

  @Mutation('createTimeAfterDeliveredOrderSetting')
  createTimeAfterDeliveredOrderSetting(
    @Args('createTimeAfterDeliveredOrderSettingDto')
    createTimeAfterDeliveredOrderSettingDto: CreateTimeAfterDeliveredOrderSettingDto,
  ) {
    return this.settingService.createTimeAfterDeliveredOrderSetting(createTimeAfterDeliveredOrderSettingDto);
  }

  @Query('findOneTimeAfterDeliveredOrderSetting')
  findOneTimeAfterDeliveredOrderSetting() {
    return this.settingService.findOneSettingByModelName(SETTING_MODEL_NAME.Setting_Order);
  }

  @Mutation('updateOneSetting')
  update(@Args('updateDistanceDto') updateDistanceDto: UpdateDistanceDto) {
    return this.settingService.update(updateDistanceDto);
  }

  @Mutation('deleteOneSetting')
  deleteOne(@Args('id') id: string) {
    return this.settingService.deleteOne(id);
  }
}
