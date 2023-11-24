import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { MENU_UPLOAD_STATUS, MERCHANT_STATUS } from '../common/constants/merchant';
import { MerchantRepository } from '../models';
import { CreateMenuUploadDto } from './dto/create-menu-upload.dto';

@Injectable()
export class MenuUploadService {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async createMerchantMenuUpload(user: any, createMenuUploadDto: CreateMenuUploadDto) {
    const merchantId = user?.merchant?._id
      ? user?.merchant?._id
      : user?.type == 'Owner'
      ? await this.merchantRepository.getOne({ ownerId: user?._id })
      : '';

    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId.toString()) });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    if (merchant.status != MERCHANT_STATUS.APPROVED_STATUS) {
      throw new BadRequestException(ERROR_CODES.err_merchant_status_is_not_approved);
    }

    if (merchant?.menu_upload_status && merchant?.menu_upload_status != MENU_UPLOAD_STATUS.REJECTED_STATUS) {
      throw new ConflictException(ERROR_CODES.err_merchant_menu_upload_is_already_exists);
    }

    await this.merchantRepository.updateOne(
      { _id: merchant._id },
      {
        menu_upload_status: MENU_UPLOAD_STATUS.PENDING_STATUS,
        menuUpload: { ...createMenuUploadDto },
      },
    );

    return { success: true };
  }
}
