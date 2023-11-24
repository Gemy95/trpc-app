import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { BaseQuery } from '../common/dto/BaseQuery.dto';
import { Discount } from '../models';
import { ProductRepository } from '../models';
import { DiscountRepository } from '../models/discount/discount.repository';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(private readonly productRepository: ProductRepository, private discountRepository: DiscountRepository) {}
  private logger = new Logger(DiscountService.name);

  public async create(createDiscountDto: CreateDiscountDto) {
    try {
      await Promise.all(
        createDiscountDto.products.map(async (id) => {
          const product = await this.productRepository.exists({
            _id: new mongoose.Types.ObjectId(id),
          });
          if (!product) throw new NotFoundException(ERROR_CODES.err_product_not_found);
          return;
        }),
      );

      const saved = await this.discountRepository.create(createDiscountDto);
      if (saved) {
        const discount: Discount = saved['_doc'];
        const updatedProducts = await Promise.all(
          createDiscountDto.products.map(async (id) => {
            return await this.productRepository.updateOne(
              { _id: new mongoose.Types.ObjectId(id) },
              {
                discount: discount._id,
              },
              { new: true, lean: true, populate: ['discount'] },
            );
          }),
        );

        return updatedProducts;
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_create_discount);
    }
  }

  public findAll(): Promise<Discount[]> {
    try {
      return this.discountRepository.aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'discount',
            as: 'products',
          },
        },
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_list_discounts);
    }
  }

  public findAllByMerchantId(merchantId: string, query: BaseQuery) {
    try {
      const { limit = 20, page = 0, paginate, sort } = query;

      return this.discountRepository.aggregate([
        {
          $lookup: {
            from: 'products',
            let: { localFieldDiscountId: { $toObjectId: '$_id' } },
            as: 'products',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$merchantId', new mongoose.Types.ObjectId(merchantId)],
                      },
                      { $eq: ['$discount', '$$localFieldDiscountId'] },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: '$products' }, 0] },
          },
        },
        {
          $skip: page <= 0 ? 0 : limit * page,
        },
        {
          $limit: limit,
        },
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_list_discounts);
    }
  }

  public async findOne(id: string): Promise<Discount> {
    try {
      const [discount] = await this.discountRepository._model.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'discount',
            as: 'products',
          },
        },
      ]);
      return discount;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(ERROR_CODES.err_discount_not_found);
    }
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    try {
      const updatedProductsIds = updateDiscountDto.products || [];
      if (updatedProductsIds.length > 0) {
        const currentProductIds =
          (await this.productRepository._model.find({ discount: id })).map((product) => {
            return product.id;
          }) || [];

        const removedProductIds = currentProductIds.filter((id) => updatedProductsIds.indexOf(id) == -1) || [];
        const newProductIds = updatedProductsIds.filter((id) => currentProductIds.indexOf(id) == -1) || [];

        await Promise.all(
          removedProductIds.map(async (id) => {
            return await this.productRepository.updateOne(
              { _id: new mongoose.Types.ObjectId(id) },
              {
                discount: null,
              },
              { new: true, lean: true },
            );
          }),
        );

        await Promise.all(
          newProductIds.map(async (productId) => {
            return await this.productRepository.updateOne(
              { _id: new mongoose.Types.ObjectId(productId) },
              {
                discount: new mongoose.Types.ObjectId(id),
              },
              { new: true, lean: true },
            );
          }),
        );
      }
      return this.discountRepository.updateOne(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        updateDiscountDto,
        { new: true, lean: true },
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'discount'));
    }
  }

  public remove(id: string): Promise<Discount> {
    try {
      return this.discountRepository.updateOne(
        {
          _id: new mongoose.Types.ObjectId(id),
          isActive: true,
        },
        { isActive: false },
        { new: true, lean: true },
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_delete.replace('{{item}}', 'discount'));
    }
  }
}
