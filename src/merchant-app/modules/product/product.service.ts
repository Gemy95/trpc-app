import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { getMealsTime } from '../common/utils/get-meals-time';
import { Merchant, MerchantRepository, Product, ProductGroupRepository, ProductRepository } from '../models';
import { ProductRequestsService } from '../requests/product-requests.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductDto } from './dto/get-all-product.dto';
import { ReorderSerialNumberDto } from './dto/reorder-product-serial.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private merchantRepository: MerchantRepository,
    private productRepository: ProductRepository,
    private productReviewService: ProductRequestsService,
    private productGroupRepository: ProductGroupRepository,
  ) {}
  async create(user: any, createProductDto: CreateProductDto, merchantId: string) {
    const merchant = await this.merchantRepository.getOne({
      isDeleted: false,
      _id: merchantId,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const merchantProductsCount = await this.productRepository.getDocumentsCount({
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });
    const newProduct = await this.prepareProduct(createProductDto);
    newProduct.merchantId = new mongoose.Types.ObjectId(merchantId);
    newProduct.serialDisplayNumber = merchantProductsCount + 1;
    newProduct.inReview = true;

    const createdProduct = await new Promise((resolve, reject) => {
      this.productRepository
        .create(newProduct)
        .then(async (data) => {
          await this.productReviewService.create(
            user,
            data?._id?.toString(),
            merchantId?.toString(),
            newProduct as unknown as UpdateProductDto,
            true,
          );
          resolve(data);
        })
        .catch((error) => {
          reject(error);
          throw new Error(error);
        });
    });

    const averageMerchantProductsPrice =
      (
        await this.productRepository._model
          .aggregate([
            { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
            { $group: { _id: null, average: { $avg: '$price' } } },
          ])
          .exec()
      )?.[0]?.average || 0;

    await this.merchantRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(merchantId) },
      {
        $set: {
          productsPriceRange: averageMerchantProductsPrice ? averageMerchantProductsPrice : 0,
        },
      },
    );

    return createdProduct;
  }

  async findOne(id: string, merchantId: string): Promise<Product> {
    const merchant = await this.getMerchantById(merchantId);

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    return this.productRepository.getOne({ isDeleted: false, _id: id, merchantId: merchant._id }, { lean: true });
  }

  async findAll(query: GetAllProductDto, merchantId: string, user?: any) {
    return this.productRepository.getProductsForMerchant(query, merchantId, user);
  }

  async remove(id: string, merchantId: string) {
    const merchant = await this.getMerchantById(merchantId);

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const product = await this.productRepository.getOne({ _id: id, merchantId: merchant._id }, { lean: true });

    if (product?.isDeleted) {
      throw new NotFoundException(ERROR_CODES.err_product_not_found);
    }

    if (!product) {
      throw new NotFoundException(ERROR_CODES.err_product_not_found);
    }

    return this.productRepository.updateOne(
      { isDeleted: false, _id: id, merchantId: merchant._id },
      { isDeleted: true },
      { new: true, lean: true },
    );
  }

  async updateOne(productId: string, updateProductDto: UpdateProductDto, merchantId: string): Promise<Product> {
    const merchant = await this.merchantRepository.getOne({
      isDeleted: false,
      _id: merchantId,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    const product = await this.productRepository.getOne({
      isDeleted: false,
      _id: productId,
      merchantId,
    });

    if (!product) {
      throw new NotFoundException(ERROR_CODES.err_product_not_found);
    }

    const newProduct = await this.prepareProduct(updateProductDto, true);

    try {
      return this.productRepository.updateOne({ _id: productId }, newProduct, {
        lean: true,
        new: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_update_product);
    }
  }

  private getMerchantById(id: string): Promise<Merchant> {
    return this.merchantRepository.getOne({
      isDeleted: false,
      _id: id,
    });
  }

  public async reOrderSerialNumber(reorderSerialNumber: ReorderSerialNumberDto): Promise<Product[]> {
    const result = await Promise.all(
      reorderSerialNumber.serials.map((element) =>
        this.productRepository.updateOne(
          {
            _id: new mongoose.Types.ObjectId(element.id),
          },
          {
            serialDisplayNumber: element.newSerialNumber,
          },
          { new: true, lean: true },
        ),
      ),
    );
    return result.sort((a, b) => {
      return a.serialDisplayNumber < b.serialDisplayNumber ? -1 : a.serialDisplayNumber > b.serialDisplayNumber ? 1 : 0;
    });
  }

  public async addBranch(merchantId: string, branchId: string, productBranchId?: string) {
    const matchQuery: { merchantId; branchesIds? } = {
      merchantId: new mongoose.Types.ObjectId(merchantId),
    };
    if (productBranchId) matchQuery.branchesIds = { $in: [new mongoose.Types.ObjectId(productBranchId)] };
    return this.productRepository.updateMany(
      matchQuery,
      { $addToSet: { branchesIds: new mongoose.Types.ObjectId(branchId) } },
      { lean: true, new: true },
      {},
    );
  }

  public async prepareProduct(product, isUpdate = false): Promise<Product> {
    const newProduct = new Product();

    newProduct.name = product?.nameArabic;
    newProduct.description = product?.descriptionArabic;
    newProduct.translation =
      product?.nameEnglish || product?.descriptionEnglish
        ? [
            {
              _lang: 'en',
              name: product?.nameEnglish || undefined,
              description: product?.descriptionEnglish || undefined,
            },
          ]
        : undefined;
    newProduct.branchesIds =
      product?.branchesIds?.length > 0 ? product?.branchesIds?.map((id) => new mongoose.Types.ObjectId(id)) : undefined;
    newProduct.categoriesIds =
      product?.categoriesIds?.length > 0
        ? product.categoriesIds?.map((id) => new mongoose.Types.ObjectId(id))
        : undefined;
    newProduct.productGroupsIds = product?.productGroupsIds?.map((id) => new mongoose.Types.ObjectId(id)) || [];
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
    newProduct.mealsTime =
      product?.mealsTime?.length > 0
        ? product?.mealsTime?.map((ele) => {
            return { name: ele, times: getMealsTime(ele) };
          })
        : undefined;
    newProduct.tagsIds = product?.tagsIds;

    newProduct.productGroupsOrders =
      Array.isArray(product?.productGroupsOrders) && product?.productGroupsOrders?.length > 0
        ? await Promise?.all(
            product?.productGroupsOrders?.map(async (item, index) => {
              const currentOptions =
                item?.options?.map((item2, index2) => {
                  return { _id: item2?._id.toString(), serialDisplayNumber: item2?.serialDisplayNumber || index2 + 1 };
                }) || [];

              Promise?.all(
                currentOptions?.map(
                  async (element) =>
                    await this.productGroupRepository.updateOne(
                      {
                        _id: new mongoose.Types.ObjectId(item.id.toString()),
                        'options._id': new mongoose.Types.ObjectId(element._id.toString()),
                      },
                      {
                        'options.$.serialDisplayNumber': element.serialDisplayNumber,
                      },
                      { new: true, lean: true },
                    ),
                ),
              );

              return {
                id: item?.id?.toString(),
                serialDisplayNumber: item?.serialDisplayNumber || index + 1,
                options: currentOptions,
              };
            }),
          )
        : undefined;

    newProduct.quantity = product?.quantity;
    newProduct.remainingQuantity = product?.quantity;

    return newProduct;
  }

  public async serialsReorderProductGroupsOrders(
    productId: string,
    reorderSerialNumber: ReorderSerialNumberDto,
  ): Promise<any> {
    await Promise.all(
      reorderSerialNumber?.serials?.map((element, index) =>
        this.productRepository._model.updateOne(
          {
            _id: new mongoose.Types.ObjectId(productId),
            'productGroupsOrders.id': element.id.toString(),
          },
          {
            'productGroupsOrders.$.serialDisplayNumber': element?.newSerialNumber || index + 1,
          },
        ),
      ),
    );
    const product = await this.productRepository.getOne({ _id: new mongoose.Types.ObjectId(productId) });
    return product?.productGroupsOrders?.sort((a, b) => {
      return a?.serialDisplayNumber < b?.serialDisplayNumber
        ? -1
        : a?.serialDisplayNumber > b?.serialDisplayNumber
        ? 1
        : 0;
    });
  }
}
