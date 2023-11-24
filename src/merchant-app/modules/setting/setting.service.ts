import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { SETTING_MODEL_NAME } from '../common/constants/setting.constants';
import { SettingRepository } from '../models/setting/setting.repository';
import { CreateBranchDistanceSettingDto } from './dtos/create-branch-distance-setting.dto';
import { CreateBranchGroupDistanceSettingDto } from './dtos/create-branch-group-distance-setting.dto';
import { CreateMarketplaceLowestOrderPriceSettingDto } from './dtos/create-marketplace-lowest-order-price-setting.dto';
import { CreateMarketplaceMerchantBranchesDistanceSettingDto } from './dtos/create-marketplace-merchant-branch-distance-setting.dto';
import { CreateMerchantLowestOrderPriceSettingDto } from './dtos/create-merchant-lowest-order-price-setting.dto';
import { CreateShoppexOrderTaxSettingDto } from './dtos/create-shoppex-order-tax-setting.dto';
import { CreateTimeAfterDeliveredOrderSettingDto } from './dtos/create-time-after-delivered-order-setting.dto';
import { CreateVerificationTypeSettingDto } from './dtos/create-verification-type-setting.dto';
import { UpdateDistanceDto } from './dtos/update-distance.dto';

@Injectable()
export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  async createBranchDistanceSetting(createDto: CreateBranchDistanceSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_Branch,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_Branch,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createVerificationTypeSetting(createDto: CreateVerificationTypeSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_Verification,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_Verification,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createBranchGroupDistanceSetting(createDto: CreateBranchGroupDistanceSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_BranchGroup,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_BranchGroup,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createMarketplaceMerchantBranchesDistanceSetting(
    createDto: CreateMarketplaceMerchantBranchesDistanceSettingDto,
  ) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_MarketplaceMerchantBranches,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_MarketplaceMerchantBranches,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createMarketplaceLowestOrderPriceSetting(createDto: CreateMarketplaceLowestOrderPriceSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_LowestMarketplaceOrderPrice,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_LowestMarketplaceOrderPrice,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createMerchantLowestOrderPriceSetting(createDto: CreateMerchantLowestOrderPriceSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_MerchantLowestPriceToOrder,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_MerchantLowestPriceToOrder,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createShoppexOrderTaxSetting(createDto: CreateShoppexOrderTaxSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_ShoppexOrderTax,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_ShoppexOrderTax,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async createTimeAfterDeliveredOrderSetting(createDto: CreateTimeAfterDeliveredOrderSettingDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: SETTING_MODEL_NAME.Setting_Order,
    });

    if (settingIsExists) {
      // throw new BadRequestException(ERROR_CODES.err_setting_already_exists);
      return this.settingRepository.updateOne(
        {
          modelName: SETTING_MODEL_NAME.Setting_Order,
        },
        createDto,
        { new: true, lean: true },
      );
    }

    return this.settingRepository.create(createDto);
  }

  async update(updateDistanceDto: UpdateDistanceDto) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: updateDistanceDto.modelName,
    });

    if (!settingIsExists) {
      throw new NotFoundException(ERROR_CODES.err_setting_not_found);
    }

    return this.settingRepository.updateOne(
      { _id: settingIsExists['_id'] },
      { ...updateDistanceDto },
      { new: true, lean: true },
    );
  }

  async deleteOne(id: string) {
    const setting = await this.settingRepository.getById(id, {});
    if (!setting) {
      throw new NotFoundException(ERROR_CODES.err_setting_not_found);
    }
    await this.settingRepository.deleteById(id);
    return { message: 'Setting Deleted Successfully' };
  }

  async findOneSettingByModelName(modelName: SETTING_MODEL_NAME) {
    const settingIsExists = await this.settingRepository.getOne({
      modelName: modelName,
    });

    if (!settingIsExists) {
      throw new BadRequestException(ERROR_CODES.err_setting_not_exists);
    }

    return settingIsExists;
  }

  public async checkVerificationSetting() {
    return this.settingRepository.getOne({
      modelName: 'verification',
    });
  }
}
