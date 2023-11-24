import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import * as _ from 'lodash';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { BranchService } from '../branch/branch.service';
import { BRANCH_STATUS, BRANCH_STATUS_TAGS } from '../common/constants/branch.constants';
import { MERCHANT_REQUEST_TYPES, MERCHANT_STATUS, MERCHANT_STATUS_TAGS } from '../common/constants/merchant';
import { REQUEST_ACTION } from '../common/constants/notification.constant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import {
  MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  REQUEST_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { REQUEST_EVENT_ROOM } from '../common/constants/socket.constants';
import { MailService } from '../mail/mail.service';
import {
  Branch,
  BranchRepository,
  MenuTemplateProductGroupRepository,
  MenuTemplateProductRepository,
  MenuTemplateRepository,
  Merchant,
  MerchantRepository,
  ProductCategoryRepository,
  ProductGroupRepository,
  ProductRepository,
  ReviewRepository,
} from '../models';
import { NotificationService } from '../notification/notification.service';
import { OperationDepartmentsGateWay } from '../socket/department.socket.gateway';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { MerchantApproveOrRejectDto } from './dto/merchant-approve-or-reject.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantRequestsService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    private merchantRepository: MerchantRepository,
    private reviewRepository: ReviewRepository,
    private mailService: MailService,
    private readonly operationDepartmentsGateWay: OperationDepartmentsGateWay,
    private readonly notificationService: NotificationService,
    private readonly merchantGateWay: MerchantGateWay,
    private branchRepository: BranchRepository,
    private menuTemplateRepository: MenuTemplateRepository,
    private productCategoryRepository: ProductCategoryRepository,
    private productGroupRepository: ProductGroupRepository,
    private productRepository: ProductRepository,
    private menuTemplateProductRepository: MenuTemplateProductRepository,
    private menuTemplateProductGroupRepository: MenuTemplateProductGroupRepository,
  ) {}

  findOne(merchantId: string, merchantRequestType: MERCHANT_REQUEST_TYPES) {
    return this.reviewRepository.getOne({ reference: new Types.ObjectId(merchantId), merchantRequestType });
  }

  async create(
    merchantId: string,
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    updateMerchantDto: UpdateMerchantDto,
    user: any,
  ) {
    const { _id } = user;

    const merchant = await this.merchantRepository.getOne({
      _id: new Types.ObjectId(merchantId),
      isDeleted: false,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const data = {
      updatedBy: new Types.ObjectId(_id),
      modelName: Merchant.name,
      reference: merchant._id,
      ...updateMerchantDto,
      name: updateMerchantDto?.nameArabic ? updateMerchantDto.nameArabic : undefined,
      description: updateMerchantDto?.descriptionArabic ? updateMerchantDto.descriptionArabic : undefined,
      locationDelta:
        updateMerchantDto?.longitudeDelta && updateMerchantDto?.latitudeDelta
          ? [updateMerchantDto.longitudeDelta, updateMerchantDto.latitudeDelta]
          : undefined,
      location:
        updateMerchantDto?.longitude && updateMerchantDto?.latitude
          ? {
              type: 'Point',
              coordinates: [updateMerchantDto.longitude, updateMerchantDto.latitude],
            }
          : undefined,
      translation:
        updateMerchantDto?.nameEnglish || updateMerchantDto?.descriptionEnglish
          ? [
              {
                _lang: 'en',
                name: updateMerchantDto?.nameEnglish ? updateMerchantDto.nameEnglish : merchant.translation[0].name,
                description: updateMerchantDto?.descriptionEnglish
                  ? updateMerchantDto.descriptionEnglish
                  : merchant.translation[0].description,
              },
            ]
          : undefined,
      bankAccount: updateMerchantDto?.bankAccount?.bank
        ? { ...updateMerchantDto?.bankAccount, bank: new mongoose.Types.ObjectId(updateMerchantDto?.bankAccount?.bank) }
        : undefined,
      merchantRequestType: merchantRequestType,
    };
    data.nameArabic && delete data.nameArabic;
    data.nameEnglish && delete data.nameEnglish;

    const updateRequestExist = await this.reviewRepository.getOne({
      reference: merchant._id,
      merchantRequestType: merchantRequestType,
    });

    if (updateRequestExist)
      throw new ConflictException(ERROR_CODES.err_already_exists.replace('{{item}}', 'update_request'));

    await this.merchantRepository.updateOne(
      {
        _id: new Types.ObjectId(merchantId),
      },
      {
        inReview: true,
      },
    );
    await this.reviewRepository._model.create(data);
    const [createdRequest] = await this.findReviewData(merchant._id, merchantRequestType);
    if (!createdRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_create_request);

    await this.notificationQueue.add(REQUEST_NOTIFICATION_PROCESS, createdRequest, {
      attempts: 3,
    });

    return createdRequest;
  }

  async update(
    requestId: string,
    merchantId: string,
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    updateMerchantDto: UpdateMerchantDto,
    user: any,
  ) {
    // this for merchant only
    const { _id } = user;

    const merchant = await this.merchantRepository.getOne({
      _id: new Types.ObjectId(merchantId),
      isDeleted: false,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const updateRequestExist = await this.reviewRepository.exists({
      _id: new Types.ObjectId(requestId),
      reference: new Types.ObjectId(merchantId),
      merchantRequestType: merchantRequestType,
    });

    if (!updateRequestExist) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    const data = {
      updatedBy: new Types.ObjectId(_id),
      ...updateMerchantDto,
      name: updateMerchantDto?.nameArabic ? updateMerchantDto.nameArabic : undefined,
      description: updateMerchantDto?.descriptionArabic ? updateMerchantDto.descriptionArabic : undefined,
      locationDelta:
        updateMerchantDto?.longitudeDelta && updateMerchantDto?.latitudeDelta
          ? [updateMerchantDto.longitudeDelta, updateMerchantDto.latitudeDelta]
          : undefined,
      location:
        updateMerchantDto?.longitude && updateMerchantDto?.latitude
          ? {
              type: 'Point',
              coordinates: [updateMerchantDto.longitude, updateMerchantDto.latitude],
            }
          : undefined,
      translation:
        updateMerchantDto?.nameEnglish || updateMerchantDto?.descriptionEnglish
          ? [
              {
                _lang: 'en',
                name: updateMerchantDto?.nameEnglish ? updateMerchantDto.nameEnglish : merchant?.translation[0]?.name,
                description: updateMerchantDto?.descriptionEnglish
                  ? updateMerchantDto.descriptionEnglish
                  : merchant?.translation[0]?.description,
              },
            ]
          : undefined,
      bankAccount:
        updateMerchantDto?.bankAccount && updateMerchantDto?.bankAccount?.bank
          ? { ...updateMerchantDto.bankAccount, bank: new mongoose.Types.ObjectId(updateMerchantDto.bankAccount.bank) }
          : undefined,
    };

    await this.reviewRepository._model.updateOne(
      {
        _id: new Types.ObjectId(requestId),
        reference: new Types.ObjectId(merchantId),
        merchantRequestType,
      },
      data,
    );

    const [updatedRequest] = await this.findReviewData(merchant._id, merchantRequestType);

    if (!updatedRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'request'));
    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'update' },
      updatedRequest,
    );
    return updatedRequest;
  }

  async approveOrReject(
    user: any,
    merchantId: string,
    merchantRequestType: MERCHANT_REQUEST_TYPES,
    changeStatusDto: MerchantApproveOrRejectDto,
  ) {
    const { status, status_tags, notes, commissions } = changeStatusDto;

    const merchant = await this.merchantRepository.getOne(
      {
        _id: new Types.ObjectId(merchantId),
        inReview: true,
      },
      { populate: [{ path: 'ownerId', select: '_id name email' }] },
    );

    if (!merchant) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    const [reviewData] = await this.findReviewData(merchant._id, merchantRequestType);

    if (!reviewData) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    if (status === MERCHANT_STATUS.REJECTED_STATUS || status === MERCHANT_STATUS.BANNED_STATUS) {
      await Promise.all([
        this.merchantRepository.updateOne(
          {
            _id: new Types.ObjectId(merchantId),
            inReview: true,
          },
          { status: status, status_tags: status_tags, inReview: false, notes },
        ),
        this.reviewRepository._model.deleteOne({
          modelName: Merchant.name,
          reference: new Types.ObjectId(merchantId),
        }),
        this.mailService.rejectEmail(notes, { merchant }),
      ]);

      await this.notificationQueue.add(
        MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
        { merchant, reviewData, actionType: 'rejected', notes },
        {
          attempts: 3,
        },
      );

      return { success: true };
    } else if (status === MERCHANT_STATUS.PENDING_STATUS) {
      await Promise.all([
        this.merchantRepository.updateOne(
          {
            _id: new Types.ObjectId(merchantId),
            inReview: true,
          },
          { inReview: true, status: MERCHANT_STATUS.PENDING_STATUS, status_tags: status_tags, notes },
        ),
      ]);

      return { success: true };
    } else {
      const updateMerchant = new Merchant();
      updateMerchant.approvedBy = new Types.ObjectId(user._id);
      updateMerchant.inReview = false;
      updateMerchant.status = reviewData.status || MERCHANT_STATUS.APPROVED_STATUS;
      updateMerchant.status_tags = reviewData.status_tags || MERCHANT_STATUS_TAGS.PRODUCTION_READY_STATUS;
      updateMerchant.name = reviewData.name;
      updateMerchant.description = reviewData.description;
      updateMerchant.locationDelta = reviewData.locationDelta;
      updateMerchant.location = reviewData.location;
      updateMerchant.translation = reviewData.translation;
      updateMerchant.notes = notes;
      updateMerchant.categoriesIds = reviewData.categoriesIds;
      updateMerchant.tagsIds = reviewData.tagsIds;
      updateMerchant.cityId = reviewData.cityId;
      updateMerchant.mobile = reviewData.mobile;
      updateMerchant.logo = reviewData.logo;
      updateMerchant.commercialIdImage = reviewData.commercialIdImage;
      updateMerchant.identificationImage = reviewData.identificationImage;
      updateMerchant.bankAccount = reviewData.bankAccount;
      updateMerchant.commissions = commissions && commissions?.length > 0 ? commissions : reviewData.commissions;
      updateMerchant.lowestPriceToOrder = reviewData.lowestPriceToOrder;
      updateMerchant.minimum_delivery_price = reviewData.minimum_delivery_price;

      let menuTemplate = {};
      if (merchant?.branchesNumber == 0 && merchantRequestType == MERCHANT_REQUEST_TYPES.DATA) {
        // in case there is no branches (first time)
        menuTemplate = await this.createProductCategoriesAndGroupsMenuTemplate(
          merchant?.categoriesIds?.[0]?.toString(),
          merchantId?.toString(),
        );
      }

      const [updatedMerchant, reviewDeleted] = await Promise.all([
        this.merchantRepository.updateOne(
          {
            _id: new Types.ObjectId(merchantId),
            inReview: true,
          },
          { ...updateMerchant, menuTemplateId: menuTemplate?.['_id'] || undefined },
        ),
        await this.reviewRepository._model.deleteOne({
          modelName: Merchant.name,
          reference: new Types.ObjectId(merchantId),
        }),
      ]);

      await this.notificationQueue.add(
        MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
        { merchant, reviewData, actionType: 'approved' },
        {
          attempts: 3,
        },
      );
      return {
        success: true,
        updatedMerchant,
        requestRemoved: reviewDeleted.acknowledged,
      };
    }
  }

  async remove(requestId: string, merchantRequestType: MERCHANT_REQUEST_TYPES) {
    const request = await this.reviewRepository.getOne({ _id: new Types.ObjectId(requestId), merchantRequestType });
    const removed = await this.reviewRepository.deleteOne({
      _id: new Types.ObjectId(requestId),
      merchantRequestType: merchantRequestType,
    });
    if (!removed) throw new BadRequestException(ERROR_CODES.err_failed_to_delete.replace('{{item}}', 'request'));
    await this.merchantRepository.updateOne({ _id: request.reference }, { inReview: false });
    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'cancel' },
      {
        _id: request._id,
      },
    );
    return { success: true };
  }

  private findReviewData(merchantId, merchantRequestType: MERCHANT_REQUEST_TYPES) {
    return this.reviewRepository._model.aggregate([
      {
        $match: {
          reference: new Types.ObjectId(merchantId),
          merchantRequestType: merchantRequestType,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { localmerchant: '$reference' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$localmerchant', '$_id'] }],
                },
              },
            },
            {
              $lookup: {
                from: 'cities',
                localField: 'cityId',
                foreignField: '_id',
                as: 'cityId',
              },
            },
            {
              $lookup: {
                from: 'banks',
                let: { bankId: '$bankAccount.bank' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$_id', '$$bankId'] }],
                      },
                    },
                  },
                ],
                as: 'bank',
              },
            },
            {
              $unwind: {
                path: '$bank',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                commercialRegistrationNumber: 1,
                commercialName: 1,
                branchesNumber: 1,
                hasDeliveryService: 1,
                address: 1,
                uuid: 1,
                status: 1,
                status_tags: 1,
                visibility_status: 1,
                logo: 1,
                identificationImage: 1,
                commercialIdImage: 1,
                balance: 1,
                location: 1,
                locationDelta: 1,
                notes: 1,
                ownerId: 1,
                cityId: 1,
                categoriesIds: 1,
                tagsIds: 1,
                city: 1,
                categories: 1,
                tags: 1,
                isDeleted: 1,
                createdAt: 1,
                updatedAt: 1,
                'bankAccount._id': 1,
                'bankAccount.bank': { $ifNull: ['$bank', {}] },
                'bankAccount.nameOfPerson': 1,
                'bankAccount.accountNumber': 1,
                'bankAccount.iban': 1,
                'bankAccount.accountType': 1,
                'bankAccount.accountImageUrl': 1,
                'bankAccount.createdAt': 1,
                'bankAccount.updatedAt': 1,
                commissions: 1,
                lowestPriceToOrder: 1,
                minimum_delivery_price: 1,
              },
            },
          ],
          as: 'reference',
        },
      },
      {
        $unwind: '$reference',
      },
    ]);
  }

  async createProductCategoriesAndGroupsMenuTemplate(merchantCategoryId: string, merchantId: string) {
    const menuTemplate = await this.menuTemplateRepository.getOne({
      categoryId: new mongoose.Types.ObjectId(merchantCategoryId.toString()),
    });

    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId) });

    if (menuTemplate) {
      const newBranch = new Branch();
      newBranch.name = 'الفرع الرئيسي';
      newBranch.translation = [
        {
          _lang: 'en',
          name: 'Main Branch',
        },
      ];
      newBranch.status = BRANCH_STATUS.PENDING_STATUS;
      newBranch.status_tags = BRANCH_STATUS_TAGS.STAGING_READY_STATUS;

      newBranch.merchantId = new mongoose.Types.ObjectId(merchantId);
      newBranch.ownerId = merchant.ownerId;
      const createBranch = await this.branchRepository.create({ ...newBranch });

      await this.merchantRepository.updateOne(
        { _id: new mongoose.Types.ObjectId(merchantId) },
        {
          $inc: { branchesNumber: 1 },
        },
      );

      const productCategories = await Promise.all(
        menuTemplate?.productCategoryAndProducts?.map(async (ele: any) => {
          const { menuTemplateProductsIds, ...productCategory } = ele;
          return this.productCategoryRepository.create({
            ...productCategory,
            merchantId: new mongoose.Types.ObjectId(merchantId),
          });
        }),
      );

      const products = menuTemplate?.productCategoryAndProducts
        ? await Promise?.all(
            menuTemplate?.productCategoryAndProducts?.map(async (ele: any) => {
              const { menuTemplateProductsIds, ...productCategoryData } = ele;
              const productCategory = productCategories?.filter(async (ele2) => {
                return ele2.name == productCategoryData.nameArabic;
              });

              await menuTemplateProductsIds?.map(async (ele3) => {
                const menuTemplateProduct = await this.menuTemplateProductRepository.getOne({
                  _id: ele3,
                });

                const hasTag = menuTemplateProduct.tagsIds
                  .map((ele) => {
                    return ele.toString();
                  })
                  .some((r1) =>
                    merchant?.tagsIds
                      .map((r2) => {
                        return r2.toString();
                      })
                      ?.includes(r1),
                  );

                const product = hasTag
                  ? await this.productRepository.create({
                      ..._.omit(menuTemplateProduct, ['_id']),
                      productGroupsIds: menuTemplateProduct.menuTemplateProductGroupsIds,
                      categoriesIds: [productCategory[0]['_id']],
                      branchesIds: [createBranch['_id']],
                    })
                  : {};

                const productGroups =
                  product &&
                  Object.values(product).length > 0 &&
                  menuTemplateProduct?.menuTemplateProductGroupsIds?.length > 0
                    ? await menuTemplateProduct?.menuTemplateProductGroupsIds?.map(async (ele: any) => {
                        const menuTemplateProductGroup = await this.menuTemplateProductGroupRepository.getOne({
                          _id: ele,
                        });

                        const isGroupExistsForMerchant = await this.productGroupRepository.getOne({
                          name: menuTemplateProductGroup.name,
                          translation: menuTemplateProductGroup.translation,
                          merchantId: new mongoose.Types.ObjectId(merchantId),
                        });

                        if (!isGroupExistsForMerchant) {
                          return this.productGroupRepository.create({
                            ..._.omit(menuTemplateProductGroup, ['_id']),
                            merchantId: new mongoose.Types.ObjectId(merchantId),
                          });
                        }
                      })
                    : [];

                return product;
              });
            }),
          )
        : [];
    }
    return menuTemplate;
  }
}
