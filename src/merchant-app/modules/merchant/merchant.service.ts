import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { Client } from 'onesignal-node';

import { ERROR_CODES } from '../../../libs/utils/src';
import { MERCHANT_REQUEST_TYPES, MERCHANT_STATUS, OFFLINE_STATUS, ONLINE_STATUS } from '../common/constants/merchant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import { AMOUNT_TYPE, ORDER_TYPE } from '../common/constants/order.constants';
import { MailService } from '../mail/mail.service';
import { MerchantRepository } from '../models';
import { MerchantRequestsService } from '../requests/merchant-requests.service';
import { CreateMerchantDto, SocialMedia } from './dto/create-merchant.dto';
import { LinkVisitDto } from './dto/link-visit.dto';
import { MerchantQueryDto } from './dto/merchant-query.input';
import { FindMerchantStatisticsDto } from './dto/merchant-statistics.dto';
import { OnlineOrOfflineMerchantDto } from './dto/online-or-offline.dto';
import { ReApplyDto } from './dto/re-apply';
import { UpdateMerchantByShoppexEmployeeDto } from './dto/update-merchant-by-shoppex-employee.dto';
import { UpdateSocialMediaDto } from './dto/update-merchant-social-media.dto';
import { UpdateMerchantStatusByMerchantEmployeeOrOwnerDto } from './dto/update-merchant-status-by-merchant-employee-or-owner.dto';

@Injectable()
export class MerchantService {
  constructor(
    @Inject('ADMIN_ONESIGNAL') private readonly oneSignal: Client,
    private readonly merchantRepository: MerchantRepository,
    private readonly mailService: MailService,
    private readonly merchantReviewService: MerchantRequestsService,
  ) {}

  private logger = new Logger(MerchantService.name);
  /**
   *
   * @desc
   * Start of CREATE requests
   */

  public async create(createMerchantDto: CreateMerchantDto, user: any) {
    try {
      let ownerId: string;
      user.type === 'ShoppexEmployee' ? (ownerId = null) : (ownerId = user._id);

      // const ownerHasMerchantAccount = await this.merchantRepository.getOne({
      //     ownerId,
      // });

      // if (ownerHasMerchantAccount)
      //     throw new BadRequestException(
      //         `Owner merchant already exist with merchantId ${ownerHasMerchantAccount.uuid}`,
      //     );

      const newMerchant = {
        ...createMerchantDto,
        name: createMerchantDto?.nameArabic,
        description: createMerchantDto?.descriptionArabic,
        locationDelta:
          createMerchantDto?.longitudeDelta && createMerchantDto?.latitudeDelta
            ? [createMerchantDto?.longitudeDelta, createMerchantDto?.latitudeDelta]
            : null,
        location:
          createMerchantDto?.longitude && createMerchantDto?.latitude
            ? {
                type: 'Point',
                coordinates: [createMerchantDto?.longitude, createMerchantDto?.latitude],
              }
            : null,
        ownerId,
        translation: [
          {
            _lang: 'en',
            name: createMerchantDto?.nameEnglish,
            description: createMerchantDto?.descriptionEnglish,
          },
        ],
        commissions: [
          {
            amount: 0,
            orderType: ORDER_TYPE.ORDER_OFFLINE,
            type: AMOUNT_TYPE.PERCENTAGE,
          },
          {
            amount: 3,
            orderType: ORDER_TYPE.ORDER_PICKUP,
            type: AMOUNT_TYPE.PERCENTAGE,
          },
          {
            amount: 5,
            orderType: ORDER_TYPE.ORDER_DELIVERY,
            type: AMOUNT_TYPE.PERCENTAGE,
          },
          {
            amount: 5,
            orderType: ORDER_TYPE.ORDER_OFFLINE_BOOK,
            type: AMOUNT_TYPE.PERCENTAGE,
          },
          {
            amount: 5,
            orderType: ORDER_TYPE.ORDER_DINING,
            type: AMOUNT_TYPE.PERCENTAGE,
          },
        ],
      };
      const createdMerchant = await new Promise((resolve, reject) => {
        this.merchantRepository
          .create(newMerchant)
          .then((data) => {
            this.merchantReviewService.create(data._id, MERCHANT_REQUEST_TYPES.DATA, newMerchant, user._id);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
            throw new Error(error);
          });
      });

      try {
        await this.mailService.createMerchant({
          name: user.name,
          email: user.email,
        });

        await this.oneSignal.createNotification({
          included_segments: ['Subscribed Users', 'Active Users'],
          contents: {
            en: NOTIFICATION_CONTENT.en.merchantCreated,
            ar: NOTIFICATION_CONTENT.ar.merchantCreated,
          },
          data: {
            ...createMerchantDto,
          },
        });

        return { success: true, createdMerchant };
      } catch (e) {
        return { success: true, createdMerchant }; // ignore email or onesignal errors
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_create_merchant);
    }
  }

  /**
   *
   * @desc
   * Start of READ requests
   */

  public findAll(query: MerchantQueryDto) {
    return this.merchantRepository.getAllMerchantsWithFilter(query);
  }

  public async findOne(merchantId: string) {
    const merchantAccount = await this.merchantRepository.getOne(
      { _id: merchantId },
      {
        lean: true,
        populate: [
          {
            path: 'cityId',
            populate: {
              path: 'country',
            },
          },
        ],
      },
    );
    if (!merchantAccount) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    merchantAccount['countryId'] = merchantAccount?.['cityId']?.['country'] || null;
    merchantAccount['cityId'] = merchantAccount?.['cityId'] || null;
    return merchantAccount;
  }

  public async getMerchantDetailsById(merchantId: string) {
    const merchantAccount = (await this.merchantRepository.getMerchantDetailsById(merchantId))?.[0];
    if (!merchantAccount) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    return merchantAccount;
  }

  public async getOwnerMerchantAccount(user: any) {
    const ownerId = user._id;
    const merchantAccount = await this.merchantRepository.getOne(
      {
        ownerId,
      },
      {
        lean: true,
        populate: [
          {
            path: 'cityId',
            populate: {
              path: 'country',
            },
          },
        ],
      },
    );
    merchantAccount['country'] = merchantAccount?.['cityId']?.['country'] || null;
    merchantAccount['countryId'] = merchantAccount?.['cityId']?.['country']?.['_id'] || null;
    merchantAccount['city'] = merchantAccount?.['cityId'] || null;
    merchantAccount['cityId'] = merchantAccount?.['cityId']?.['_id'] || null;
    if (!merchantAccount) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    return merchantAccount;
  }

  public getMerchantStatisticsById(merchantId: string, findMerchantStatisticsDto: FindMerchantStatisticsDto) {
    return this.merchantRepository.getMerchantStatisticsById(merchantId, findMerchantStatisticsDto);
  }

  /**
   *
   * @desc
   * Start of UPDATE requests
   */

  public async onlineOffline(changeStatusDto: OnlineOrOfflineMerchantDto) {
    const { merchantId, status, notes, ownerId } = changeStatusDto;

    const updateQuery = {
      _id: merchantId,
      status: {
        $in: [ONLINE_STATUS, OFFLINE_STATUS],
        $ne: status,
      },
    };

    const findQuery = { _id: merchantId };

    if (ownerId) {
      updateQuery['ownerId'] = ownerId;
      findQuery['ownerId'] = ownerId;
    }

    const isExists = await this.merchantRepository.exists(findQuery);

    if (!isExists) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const merchant = await this.merchantRepository.updateOne(updateQuery, {
      status,
      notes,
    });

    if (!merchant) {
      throw new ConflictException(ERROR_CODES.err_invalid_update_status);
    }

    return merchant;
  }

  public async reApply(reApplyDto: ReApplyDto) {
    const { merchantId, status, notes } = reApplyDto;

    const isExists = await this.merchantRepository.exists({ _id: merchantId });

    if (!isExists) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const merchant = await this.merchantRepository.updateOne(
      { _id: merchantId, status: MERCHANT_STATUS.REJECTED_STATUS },
      { status, notes },
    );

    if (!merchant) {
      throw new ConflictException(ERROR_CODES.err_invalid_update_status);
    }

    return merchant;
  }

  public async updateMerchantStatusByOwnerOrMerchantEmployee(
    merchantId: string,
    updateDto: UpdateMerchantStatusByMerchantEmployeeOrOwnerDto,
    user: any,
  ) {
    return this.merchantRepository.updateOne(
      { _id: merchantId, ownerId: user._id },
      { visibility_status: updateDto.visibility_status },
    );
  }

  public async updateByShoppexEmployee(
    merchantId: string,
    updateMerchantByShoppexEmployeeDto: UpdateMerchantByShoppexEmployeeDto,
  ) {
    const merchant = await this.merchantRepository.getOne({
      _id: merchantId,
      isDeleted: false,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const data = {
      ...updateMerchantByShoppexEmployeeDto,
      name: updateMerchantByShoppexEmployeeDto?.nameArabic ? updateMerchantByShoppexEmployeeDto.nameArabic : undefined,
      locationDelta:
        updateMerchantByShoppexEmployeeDto?.longitudeDelta && updateMerchantByShoppexEmployeeDto?.latitudeDelta
          ? [updateMerchantByShoppexEmployeeDto.longitudeDelta, updateMerchantByShoppexEmployeeDto.latitudeDelta]
          : undefined,
      location:
        updateMerchantByShoppexEmployeeDto?.longitude && updateMerchantByShoppexEmployeeDto?.latitude
          ? {
              type: 'Point',
              coordinates: [updateMerchantByShoppexEmployeeDto.longitude, updateMerchantByShoppexEmployeeDto.latitude],
            }
          : undefined,
      translation: updateMerchantByShoppexEmployeeDto?.nameEnglish
        ? [
            {
              _lang: 'en',
              name: updateMerchantByShoppexEmployeeDto.nameEnglish,
            },
          ]
        : undefined,
    };

    return this.merchantRepository.updateOne(
      {
        _id: merchantId,
      },
      { ...data },
    );
  }

  public async updateSocialMedia(merchantId: string, updateSocialMediaDto: UpdateSocialMediaDto) {
    try {
      const merchant = await this.merchantRepository.getOne({
        isDeleted: false,
        _id: new Types.ObjectId(merchantId),
      });

      if (!merchant) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);

      const data = new Object();

      if (updateSocialMediaDto.twitterUrl) {
        if (merchant.twitterUrl) data['twitterUrl.url'] = updateSocialMediaDto.twitterUrl;
        else data['twitterUrl'] = { url: updateSocialMediaDto.twitterUrl, visits: 0 };
      }
      if (updateSocialMediaDto.facebookUrl) {
        if (merchant.facebookUrl) data['facebookUrl.url'] = updateSocialMediaDto.facebookUrl;
        else data['facebookUrl'] = { url: updateSocialMediaDto.facebookUrl, visits: 0 };
      }
      if (updateSocialMediaDto.websiteUrl) {
        if (merchant.websiteUrl) data['websiteUrl.url'] = updateSocialMediaDto.websiteUrl;
        else data['websiteUrl'] = { url: updateSocialMediaDto.websiteUrl, visits: 0 };
      }
      if (updateSocialMediaDto.snapUrl) {
        if (merchant.snapUrl) data['snapUrl.url'] = updateSocialMediaDto.snapUrl;
        else data['snapUrl'] = { url: updateSocialMediaDto.snapUrl, visits: 0 };
      }
      if (updateSocialMediaDto.tiktokUrl) {
        if (merchant.tiktokUrl) data['tiktokUrl.url'] = updateSocialMediaDto.tiktokUrl;
        else data['tiktokUrl'] = { url: updateSocialMediaDto.tiktokUrl, visits: 0 };
      }

      const updatedSocialMedia = await this.merchantRepository.updateOne(
        {
          _id: new Types.ObjectId(merchantId),
          isDeleted: false,
        },
        { $set: data },
      );

      return (updatedSocialMedia && { success: true }) || { success: false };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async linkVisits(id: string, type: LinkVisitDto) {
    try {
      const merchant = await this.merchantRepository.getOne({
        isDeleted: false,
        _id: new Types.ObjectId(id),
      });

      if (!merchant) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);

      const key: SocialMedia = merchant[type.link];
      key.visits += 1;
      const data = new Object();
      data[type.link] = key;
      await this.merchantRepository.updateOne(
        {
          _id: new Types.ObjectId(id),
          isDeleted: false,
        },
        data,
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        success: false,
      };
    }
  }

  public async publishMerchant(id) {
    return this.merchantRepository.updateOne(
      {
        _id: new Types.ObjectId(id),
      },
      { status: MERCHANT_STATUS.APPROVED_STATUS },
    );
  }

  async updateMerchantLowestPriceToOrder(lowestPriceToOrder, user: any) {
    const merchantId = user?.merchant?._id || '';
    await this.merchantRepository.updateOne(
      {
        _id: new Types.ObjectId(merchantId),
      },
      { lowestPriceToOrder: lowestPriceToOrder },
    );
    return { success: true };
  }

  async updateMerchantMinimumDeliveryPrice(minimum_delivery_price, user: any) {
    const merchantId = user?.merchant?._id || '';
    await this.merchantRepository.updateOne(
      {
        _id: new Types.ObjectId(merchantId),
      },
      { minimum_delivery_price: minimum_delivery_price },
    );
    return { success: true };
  }
}
