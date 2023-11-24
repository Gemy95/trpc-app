import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../common/utils/generate-filters';
import { MerchantRepository, ProductCategoryDocument, ProductCategoryRepository } from '../models';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { CreateProductCategoryDto } from './dto/product-category.dto';
import { ReorderSerialNumberDto } from './dto/reorder-category-serial.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepo: ProductCategoryRepository,
    private readonly merchantRepository: MerchantRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(
    merchantId: string,
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryDocument> {
    const merhcnatExist = await this.merchantRepository.getOne({
      _id: new Types.ObjectId(merchantId),
      isDeleted: false,
    });
    if (!merhcnatExist) throw new NotFoundException(ERROR_CODES.err_product_category_not_found);

    const merchantProductsCategoryCount = await this.productCategoryRepo.getDocumentsCount({
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });

    const newProductCategoryData = {
      ...createProductCategoryDto,
      name: createProductCategoryDto.nameArabic,
      translation: [
        {
          _lang: 'en',
          name: createProductCategoryDto.nameEnglish,
        },
      ],
      merchantId,
      serialDisplayNumber: merchantProductsCategoryCount + 1,
    };

    return this.productCategoryRepo.create(newProductCategoryData);
  }

  async getAll(merchantId: string, params: ProductCategoryQueryDto) {
    const { limit = 25, page = 0, paginate = false, sort, search, ...rest } = params;
    const generatedMatch = generateFilters(rest);
    const generatedSearch = generateFilters({ search });

    const result = await this.productCategoryRepo.aggregate([
      {
        $match: {
          merchantId: new Types.ObjectId(merchantId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          as: 'merchantId',
          let: { merchantId: { $toObjectId: merchantId } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$merchantId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'branches',
          as: 'branches',
          let: { merchantId: { $toObjectId: merchantId } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$merchantId', '$$merchantId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'products',
          as: 'products',
          let: { productCategoryId: { $toObjectId: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$$productCategoryId', '$categoriesIds'] }],
                },
              },
            },
          ],
        },
      },
      { $addFields: { productsCount: { $size: '$products' } } },
      {
        $match: {
          ...generatedMatch,
          ...generatedSearch,
        },
      },
      {
        $project: {
          name: 1,
          status: 1,
          branches: 1,
          merchantId: 1,
          image: 1,
          search: 1,
          translation: 1,
          isDeleted: 1,
          serialDisplayNumber: 1,
          productsCount: 1,
        },
      },
      {
        $sort: sort
          ? sort
          : {
              serialDisplayNumber: 1,
            },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    const count = await this.productCategoryRepo._model.countDocuments({
      merchantId: new mongoose.Types.ObjectId(merchantId),
      isDeleted: false,
      ...generatedMatch,
      ...generatedSearch,
    });

    const pagesCount = Math.ceil(count / limit) || 1;

    return { ...result, page: page, pages: pagesCount, length: count };
  }

  async getOne(merchantId: string, id: string) {
    const productCategory = await this.productCategoryRepo.getOne(
      {
        _id: new Types.ObjectId(id),
        merchantId: new Types.ObjectId(merchantId),
      },
      { populate: ['merchantId'] },
    );
    if (!productCategory) throw new NotFoundException(ERROR_CODES.err_product_category_not_found);

    return productCategory;
  }

  async updateOne(merchantId: string, id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const productCategory = await this.productCategoryRepo.getOne(
      {
        _id: new Types.ObjectId(id),
        merchantId: new Types.ObjectId(merchantId),
        isDeleted: false,
      },
      {},
    );
    if (!productCategory) throw new NotFoundException(ERROR_CODES.err_product_category_not_found);
    const updateProductCategoryData = {
      ...updateProductCategoryDto,
      name: updateProductCategoryDto?.nameArabic ? updateProductCategoryDto.nameArabic : undefined,
      translation: updateProductCategoryDto?.nameEnglish
        ? [
            {
              _lang: 'en',
              name: updateProductCategoryDto.nameEnglish,
            },
          ]
        : undefined,
    };

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const updatedProductCategory = this.productCategoryRepo.updateOne(
        {
          _id: new Types.ObjectId(id),
          merchantId: new Types.ObjectId(merchantId),
        },
        updateProductCategoryData,
        { new: true, lean: true },
      );

      await session.commitTransaction();

      return updatedProductCategory;
    } catch (error) {
      // Rollback any changes made in the database
      await session.abortTransaction();

      // logging the error
      console.error(error);

      // Rethrow the error
      throw error;
    } finally {
      // Ending the session
      session.endSession();
    }
  }

  async remove(merchantId: string, id: string) {
    const productCategory = await this.productCategoryRepo.getOne(
      {
        _id: new Types.ObjectId(id),
        merchantId: new Types.ObjectId(merchantId),
      },
      {},
    );
    if (!productCategory) {
      throw new NotFoundException(ERROR_CODES.err_product_category_not_found);
    }
    await this.productCategoryRepo.updateOne(
      {
        _id: new Types.ObjectId(id),
        merchantId: new Types.ObjectId(merchantId),
      },
      {
        isDeleted: true,
      },
      { new: true, lean: true },
    );
    return { message: 'ProductCategory Deleted Successfully' };
  }

  public async reOrderSerialNumber(reorderSerialNumber: ReorderSerialNumberDto) {
    const result = await Promise.all(
      reorderSerialNumber.serials.map((element) =>
        this.productCategoryRepo.updateOne(
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
}
