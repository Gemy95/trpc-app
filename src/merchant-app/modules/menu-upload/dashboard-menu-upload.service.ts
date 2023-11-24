import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { MENU_UPLOAD_STATUS, MERCHANT_STATUS } from '../common/constants/merchant';
import { MerchantRepository } from '../models';
import { CreateMenuUploadDto } from './dto/create-menu-upload.dto';
import { DashboardUpdateMenuUploadDto } from './dto/dashboard-update-menu-upload.dto';
import { MenuUploadFilterDto } from './dto/menu-upload-filter.dto';

@Injectable()
export class DashboardMenuUploadService {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async dashboardFindOneMerchantMenuUpload(user: any, merchantId: string) {
    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId.toString()) });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    return {
      merchantId: merchant._id,
      name: merchant.name,
      translation: merchant.translation,
      menu_upload_status: merchant.menu_upload_status,
      menuUpload: merchant.menuUpload,
    };
  }

  async dashboardFindAllMerchantsMenuUpload(user: any, query: MenuUploadFilterDto) {
    return this.merchantRepository.dashboardFindAllMerchantsMenuUpload(user, query);
  }

  async dashboardUpdateMerchantMenuUpload(
    user: any,
    merchantId: string,
    dashboardUpdateMenuUploadDto: DashboardUpdateMenuUploadDto,
  ) {
    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId.toString()) });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const updatedMerchant = await this.merchantRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(merchantId.toString()) },
      {
        menu_upload_status: dashboardUpdateMenuUploadDto.menu_upload_status,
      },
    );

    return {
      success: true,
    };
  }
}
