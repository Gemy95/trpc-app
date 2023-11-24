import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Queue } from 'bull';
import * as _ from 'lodash';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { AttachmentsService } from '../attachments/attachments.service';
import { ORDER_ACTION, REQUEST_ACTION } from '../common/constants/notification.constant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import {
  PENDING_STATUS,
  PRODUCT_REJECTED_STATUS,
  PRODUCTION_STATUS,
  REJECTED_STATUS,
} from '../common/constants/product';
import {
  NOTIFICATION_QUEUE,
  PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  REQUEST_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { REQUEST_EVENT_ROOM } from '../common/constants/socket.constants';
import { getMealsTime } from '../common/utils/get-meals-time';
import { MailService } from '../mail/mail.service';
import { MerchantRepository, Product, ProductRepository, Review, ReviewRepository } from '../models';
import { NotificationService } from '../notification/notification.service';
import { OperationDepartmentsGateWay } from '../socket/department.socket.gateway';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { ProductApproveOrReject } from './dto/product-approve-or-reject.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRequestsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly attachmentService: AttachmentsService,
    private readonly mailService: MailService,
    private readonly operationDepartmentsGateWay: OperationDepartmentsGateWay,
    private readonly notificationService: NotificationService,
    private readonly merchantGateWay: MerchantGateWay,
  ) {}

  async findOne(productId: string, user: any) {
    const merchantId = user?.merchant?._id
      ? user?.merchant?._id
      : user?.type == 'Owner'
      ? (await this.merchantRepository.getOne({ ownerId: user?._id }))._id.toString()
      : '';

    if (user?.type != 'ShoppexEmployee') {
      const hasProduct = await this.productRepository.getOne({
        _id: new mongoose.Types.ObjectId(productId),
        merchantId: new mongoose.Types.ObjectId(merchantId),
      });

      if (!hasProduct) {
        throw new NotFoundException(ERROR_CODES.err_product_not_found);
      }
    }

    return this.reviewRepository.getOne({
      reference: new mongoose.Types.ObjectId(productId),
    });
  }

  async create(
    user: any,
    productId: string,
    merchantId: string,
    updateProductDto: UpdateProductDto,
    isFirstTime = false,
  ) {
    const { _id } = user;
    const newReview = new Review();
    newReview.modelName = Product.name;
    newReview.updatedBy = new mongoose.Types.ObjectId(_id);
    newReview.reference = new mongoose.Types.ObjectId(productId);

    if (updateProductDto['inReview'] && !isFirstTime) {
      return this.reviewRepository._model.create({ ...newReview, ...updateProductDto });
    }

    const requestExist = await this.reviewRepository.exists({
      modelName: Product.name,
      reference: new mongoose.Types.ObjectId(productId),
    });

    if (requestExist) throw new ConflictException(ERROR_CODES.err_already_exists.replace('{{item}}', 'update_request'));

    const merchant = await this.merchantRepository.getOne({
      isDeleted: false,
      _id: new mongoose.Types.ObjectId(merchantId),
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const product = await this.productRepository.getOne({
      isDeleted: false,
      _id: new mongoose.Types.ObjectId(productId),
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });

    if (!product) throw new NotFoundException(ERROR_CODES.err_product_not_found);

    const newProduct = this.prepareProductData({ inReview: true, ...updateProductDto }, product, isFirstTime);
    const data = { ...newReview, ...newProduct };

    await this.productRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(productId),
      },
      { inReview: true },
      { new: true },
    );

    await this.reviewRepository._model.create(data);
    const [createdRequest] = await this.findProductReview(product._id);
    if (!createdRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_create_request);

    await this.notificationQueue.add(REQUEST_NOTIFICATION_PROCESS, createdRequest, {
      attempts: 3,
    });

    return createdRequest;
  }

  async update(user: any, requestId: string, productId: string, updateProductDto: UpdateProductDto) {
    const requestExist = await this.reviewRepository.exists({
      modelName: Product.name,
      _id: new mongoose.Types.ObjectId(requestId),
      reference: new mongoose.Types.ObjectId(productId),
    });

    if (!requestExist) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    const { _id } = user;

    const product = await this.productRepository.getOne({
      isDeleted: false,
      _id: new mongoose.Types.ObjectId(productId),
      inReview: true,
    });

    if (!product) throw new NotFoundException(ERROR_CODES.err_product_not_found);

    const data = {
      updatedBy: new mongoose.Types.ObjectId(_id),
      ...updateProductDto,
      name: updateProductDto?.nameArabic ? updateProductDto.nameArabic : product.name,
      description: updateProductDto?.descriptionArabic ? updateProductDto.descriptionArabic : product.description,

      translation:
        updateProductDto?.nameEnglish || updateProductDto.descriptionEnglish
          ? {
              _lang: 'en',
              name: updateProductDto?.nameEnglish ? updateProductDto.nameEnglish : product.translation[0].name,
              description: updateProductDto?.descriptionEnglish
                ? updateProductDto.descriptionEnglish
                : product.translation[0].description,
            }
          : undefined,

      images: updateProductDto?.images?.map((image) => ({
        url: image?.url,
        title: image?.titleArabic,
        description: image?.descriptionArabic,
        translation: {
          _lang: 'en',
          title: image?.titleEnglish,
          description: image?.descriptionEnglish,
        },
      })),

      mainImage: updateProductDto?.mainImage?.url
        ? {
            url: updateProductDto?.mainImage.url,
            title: updateProductDto?.mainImage?.titleArabic,
            description: updateProductDto?.mainImage?.descriptionArabic,
            translation: updateProductDto?.mainImage?.titleEnglish
              ? {
                  _lang: 'en',
                  title: updateProductDto?.mainImage?.titleEnglish,
                  description: updateProductDto?.mainImage?.descriptionEnglish,
                }
              : undefined,
          }
        : undefined,
      mealsTime: updateProductDto?.mealsTime
        ? updateProductDto?.mealsTime.map((ele) => {
            return { name: ele, times: getMealsTime(ele) };
          })
        : undefined,
      quantity: updateProductDto?.quantity || undefined,
      remainingQuantity: updateProductDto?.quantity || undefined,
    };

    await this.reviewRepository._model.updateOne(
      {
        _id: new mongoose.Types.ObjectId(requestId),
      },
      data,
      { new: true, lean: true },
    );
    const [updatedRequest] = await this.findProductReview(product._id);

    if (!updatedRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'request'));
    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'update' },
      updatedRequest,
    );
    return updatedRequest;
  }

  async approveOrReject(user: any, id: string, merchant: string, approveOrRejectDto: ProductApproveOrReject) {
    const { _id } = user;
    const { approveStatus, build_status, notes } = approveOrRejectDto;
    const product = await this.isProductExist(id);
    const [review] = await this.findProductReview(id);
    try {
      if (approveStatus === REJECTED_STATUS && product.build_status === PENDING_STATUS) {
        if (review.images && product.images) {
          const removeImages = review?.images?.filter(function (image) {
            return product?.images?.some((el) => el.url === image.url);
          });
          if (removeImages.length >= 1) await this.attachmentService.deleteSingleOrMultiFile(removeImages);
        }
        await Promise.all([
          this.productRepository.updateOne(
            {
              _id: new mongoose.Types.ObjectId(id),
              inReview: true,
            },
            { build_status, inReview: false },
          ),
          this.reviewRepository._model.deleteOne({
            modelName: Product.name,
            reference: new mongoose.Types.ObjectId(id),
          }),
          this.mailService.rejectEmail(notes, { product }),
        ]);

        await this.notificationQueue.add(
          PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
          { product, review, actionType: 'rejected', notes },
          {
            attempts: 3,
          },
        );

        return { success: true };
      } else if (approveStatus === REJECTED_STATUS) {
        if (review.images && product.images) {
          const removeImages = review?.images?.filter(function (image) {
            return !product?.images?.some((el) => el.url === image.url);
          });

          if (removeImages.length >= 1) await this.attachmentService.deleteSingleOrMultiFile(removeImages);
        }
        await Promise.all([
          this.productRepository.updateOne(
            {
              _id: new mongoose.Types.ObjectId(id),
              inReview: true,
            },
            { inReview: false },
          ),
          this.reviewRepository._model.deleteOne({
            modelName: Product.name,
            reference: new mongoose.Types.ObjectId(id),
          }),
          this.mailService.rejectEmail(notes, { product }),
        ]);

        await this.notificationQueue.add(
          PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
          { product, review, actionType: 'rejected', notes },
          {
            attempts: 3,
          },
        );
        return { success: true };
      } else {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
          if (review?.serialDisplayNumber) {
            const merchantProducts: Array<Product> = (
              await this.productRepository.getAll({
                merchantId: new mongoose.Types.ObjectId(merchant),
              })
            )?.['products']?.sort((a, b) => parseInt(a.serialDisplayNumber) - parseInt(b.serialDisplayNumber));

            const productCurrentIndex = merchantProducts.findIndex((item) => {
              return item._id.toString() == id;
            });

            if (Array.isArray(merchantProducts) && merchantProducts.length == 0) {
              review.serialDisplayNumber = 1;
            } else if (Array.isArray(merchantProducts) && review.serialDisplayNumber > merchantProducts.length) {
              review.serialDisplayNumber = merchantProducts.length;
            } else if (Array.isArray(merchantProducts)) {
              for (let i = 0; i < merchantProducts.length; i++) {
                if (
                  (review.serialDisplayNumber < merchantProducts[i]?.serialDisplayNumber &&
                    i <= productCurrentIndex - 1 &&
                    i >= review.serialDisplayNumber) ||
                  (i + 1 == review.serialDisplayNumber && productCurrentIndex > i)
                ) {
                  await this.productRepository.updateOne(
                    { _id: merchantProducts[i]._id },
                    {
                      $set: {
                        serialDisplayNumber: merchantProducts[i].serialDisplayNumber + 1,
                      },
                    },
                  );
                } else if (
                  (review.serialDisplayNumber > merchantProducts[i]?.serialDisplayNumber &&
                    i >= productCurrentIndex + 1 &&
                    i <= review.serialDisplayNumber) ||
                  (i + 1 == review.serialDisplayNumber && productCurrentIndex < i)
                ) {
                  await this.productRepository.updateOne(
                    { _id: merchantProducts[i]._id },
                    {
                      $set: {
                        serialDisplayNumber: merchantProducts[i].serialDisplayNumber - 1,
                      },
                    },
                  );
                }
              }
            }
          }
          if (review.images && product.images) {
            const removeImages = product?.images?.filter(function (image) {
              return !review?.images?.some((el) => el.url === image.url);
            });
            if (removeImages.length >= 1) await this.attachmentService.deleteSingleOrMultiFile(removeImages);
          }

          const data = {
            ..._.omit(review, ['_id', 'inReview', 'reference', 'modelName', 'approveStatus', 'release_status']),
            build_status,
            release_status: PRODUCTION_STATUS,
            inReview: false,
            approvedBy: new mongoose.Types.ObjectId(_id),
          };
          const [updatedProduct, reviewDeleted] = await Promise.all([
            this.productRepository.updateOne(
              {
                _id: new mongoose.Types.ObjectId(id),
                inReview: true,
              },
              data,
              { new: true, lean: true },
            ),
            this.reviewRepository._model.deleteOne({
              modelName: Product.name,
              reference: new mongoose.Types.ObjectId(id),
            }),
          ]);

          await session.commitTransaction();

          await this.notificationQueue.add(
            PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
            { product, review, actionType: 'approved' },
            {
              attempts: 3,
            },
          );

          return {
            success: true,
            updatedProduct,
            requestRemoved: reviewDeleted.acknowledged,
          };
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          await session.endSession();
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async remove(requestId: string) {
    const request = await this.reviewRepository.getOne({ _id: new mongoose.Types.ObjectId(requestId) });
    const removed = await this.reviewRepository.deleteOne({
      _id: new mongoose.Types.ObjectId(requestId),
    });
    if (!removed) throw new BadRequestException(ERROR_CODES.err_failed_to_delete.replace('{{item}}', 'request'));
    await this.productRepository.updateOne({ _id: request.reference }, { inReview: false });

    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'cancel' },
      { _id: request._id },
    );
    return { success: true };
  }

  private async findProductReview(id: string) {
    return this.reviewRepository._model.aggregate([
      {
        $match: {
          modelName: 'Product',
          reference: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'products',
          let: { product_id: '$reference' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$product_id', '$_id'] }],
                },
              },
            },
          ],
          as: 'reference',
        },
      },
      {
        $unwind: {
          path: '$reference',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  private async isProductExist(id: string) {
    const product = await this.productRepository.getOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
      {
        populate: [
          { path: 'merchantId', select: 'name ownerId', populate: [{ path: 'ownerId', select: '_id name email' }] },
        ],
      },
    );

    if (!product) {
      throw new NotFoundException(ERROR_CODES.err_product_not_found);
    }

    if (/*product?.build_status == PRODUCT_REJECTED_STATUS ||*/ !product.inReview) {
      throw new NotFoundException(ERROR_CODES.err_product_not_in_review);
    }

    return product;
  }

  private prepareProductData(product, oldProduct?: Product, isFirstTime = false) {
    const newProduct = new Product();

    newProduct.inReview = product.inReview ?? false;
    newProduct.name = product?.nameArabic || product?.name;
    newProduct.description = product?.descriptionArabic || product?.description;
    newProduct.translation = product?.translation ?? [
      {
        _lang: 'en',
        name: product.nameEnglish ?? oldProduct.translation[0].name,
        description: product.descriptionEnglish ?? oldProduct.translation[0].description,
      },
    ];
    newProduct.branchesIds = product?.branchesIds?.map((id) => new mongoose.Types.ObjectId(id));
    newProduct.categoriesIds = product?.categoriesIds?.map((id) => new mongoose.Types.ObjectId(id));
    newProduct.productGroupsIds = product?.productGroupsIds?.map((id) => new mongoose.Types.ObjectId(id));
    newProduct.approvedBy = new mongoose.Types.ObjectId(product?.approvedBy);
    newProduct.images =
      product?.images &&
      product?.images?.map((image) => ({
        url: image?.url,
        title: image?.titleArabic,
        description: image?.descriptionArabic,
        translation: [
          {
            _lang: 'en',
            title: image?.titleEnglish,
            description: image?.descriptionEnglish,
          },
        ],
      }));
    newProduct.mainImage = product?.mainImage && {
      url: product?.mainImage?.url,
      title: product?.mainImage?.titleArabic,
      description: product?.mainImage?.descriptionArabic,
      translation: [
        {
          _lang: 'en',
          title: product?.mainImage?.titleEnglish,
          description: product?.mainImage?.descriptionEnglish,
        },
      ],
    };
    newProduct.price = product?.price;
    newProduct.preparationTime = product?.preparationTime;
    newProduct.status = product?.status;
    newProduct.calories = product?.calories;
    newProduct.build_status = product?.build_status;
    newProduct.release_status = product?.release_status;
    newProduct.status = product?.status;
    newProduct.mealsTime = isFirstTime
      ? product?.mealsTime
      : product?.mealsTime?.map((ele) => {
          return { name: ele, times: getMealsTime(ele) };
        });
    newProduct.productGroupsOrders = product?.productGroupsOrders;
    newProduct.quantity = product?.quantity;
    newProduct.remainingQuantity = product?.quantity;

    return newProduct;
  }
}
