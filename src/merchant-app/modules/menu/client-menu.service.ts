import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { APPROVED_STATUS, PRODUCTION_STATUS } from '../common/constants/product';
import { ACTIVE } from '../common/constants/status.constants';
import { BranchRepository, ProductCategoryRepository } from '../models';
import { PRODUCT_CATEGORY_STATUS } from '../product-category/dto/product-category.enum';
import { MenuQueryDto } from './dto/menu-query.dto';

@Injectable()
export class ClientMenuService {
  constructor(
    private branchRepository: BranchRepository,
    private productCategoryRepository: ProductCategoryRepository,
  ) {}

  public async marketplaceMenu(merchantId: string, params: MenuQueryDto | any, lang: string) {
    const { branchId } = params || {};

    const [branch] = await this.branchRepository._model.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(branchId),
        },
      },
      {
        $facet: {
          statistics: [
            {
              $lookup: {
                from: 'products',
                as: 'products',
                let: {
                  branch: { $toObjectId: '$_id' },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$merchantId', new Types.ObjectId(merchantId)] },
                          { $in: ['$$branch', '$branchesIds'] },
                          { $eq: ['$build_status', APPROVED_STATUS] },
                          { $eq: ['$release_status', PRODUCTION_STATUS] },
                          { $eq: ['$status', ACTIVE] },
                          { $eq: ['$isDeleted', false] },
                          { $gt: ['$remainingQuantity', 0] },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $project: {
                client_visits: 1,
                avgProductsPrepTime: { $avg: '$products.preparationTime' },
                avgProductsPrice: { $avg: '$products.price' },
              },
            },
          ],
          bestSalesProducts: [
            {
              $lookup: {
                from: 'orders',
                as: 'orders',
                let: {
                  branchId: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$branchId', '$$branchId'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'products',
                      as: 'product',
                      let: {
                        productIds: '$items.productId',
                        productCounts: { $arrayElemAt: ['$items.count', 0] },
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $in: ['$$branchId', '$branchesIds'] },
                                { $eq: ['$merchantId', new Types.ObjectId(merchantId)] },
                                { $eq: ['$build_status', APPROVED_STATUS] },
                                { $eq: ['$release_status', PRODUCTION_STATUS] },
                                { $eq: ['$status', ACTIVE] },
                                { $eq: ['$isDeleted', false] },
                                { $gt: ['$remainingQuantity', 0] },
                              ],
                            },
                          },
                        },
                        {
                          $lookup: {
                            from: 'productgroups',
                            localField: 'productGroupsIds',
                            foreignField: '_id',
                            as: 'groups',
                          },
                        },
                        {
                          $lookup: {
                            from: 'productcategories',
                            localField: 'categoriesIds',
                            foreignField: '_id',
                            as: 'productcategories',
                          },
                        },
                        {
                          $unwind: {
                            path: '$productcategories',
                            preserveNullAndEmptyArrays: true,
                          },
                        },
                        {
                          $match: {
                            'productcategories.status': PRODUCT_CATEGORY_STATUS.ACTIVE,
                          },
                        },
                        {
                          $project: {
                            _id: 1,
                            count: '$$productCounts',
                            name: 1,
                            description: 1,
                            preparationTime: 1,
                            productGroupsIds: 1,
                            categoriesIds: 1,
                            merchantId: 1,
                            branchesIds: 1,
                            images: 1,
                            mainImage: 1,
                            price: 1,
                            numberOfSale: 1,
                            translation: 1,
                            isDeleted: 1,
                            build_status: 1,
                            release_status: 1,
                            status: 1,
                            calories: 1,
                            serialDisplayNumber: 1,
                            inReview: 1,
                            discount: 1,
                            approvedBy: 1,
                            notes: 1,
                            mealsTime: 1,
                            groups: 1,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                ordersProductsItems: {
                  $reduce: {
                    input: '$orders.product',
                    initialValue: [],
                    in: { $concatArrays: ['$$value', '$$this'] },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                ordersProductsItems: 1,
              },
            },
            {
              $unwind: '$ordersProductsItems',
            },
            {
              $group: {
                _id: '$ordersProductsItems._id',
                count: {
                  $sum: '$ordersProductsItems.count',
                },
                name: { $first: '$ordersProductsItems.name' },
                description: { $first: '$ordersProductsItems.description' },
                preparationTime: { $first: '$ordersProductsItems.preparationTime' },
                productGroupsIds: { $first: '$ordersProductsItems.productGroupsIds' },
                categoriesIds: { $first: '$ordersProductsItems.categoriesIds' },
                merchantId: { $first: '$ordersProductsItems.merchantId' },
                branchesIds: { $first: '$ordersProductsItems.branchesIds' },
                images: { $first: '$ordersProductsItems.images' },
                mainImage: { $first: '$ordersProductsItems.mainImage' },
                price: { $first: '$ordersProductsItems.price' },
                numberOfSale: { $first: '$ordersProductsItems.numberOfSale' },
                translation: { $first: '$ordersProductsItems.translation' },
                isDeleted: { $first: '$ordersProductsItems.isDeleted' },
                build_status: { $first: '$ordersProductsItems.build_status' },
                release_status: { $first: '$ordersProductsItems.release_status' },
                status: { $first: '$ordersProductsItems.status' },
                calories: { $first: '$ordersProductsItems.calories' },
                serialDisplayNumber: { $first: '$ordersProductsItems.serialDisplayNumber' },
                inReview: { $first: '$ordersProductsItems.inReview' },
                discount: { $first: '$ordersProductsItems.discount' },
                approvedBy: { $first: '$ordersProductsItems.approvedBy' },
                notes: { $first: '$ordersProductsItems.notes' },
                mealsTime: { $first: '$ordersProductsItems.mealsTime' },
                groups: { $first: '$ordersProductsItems.groups' },
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
            {
              $limit: 10,
            },
          ],
        },
      },
    ]);

    if (!branch) throw new NotFoundException(ERROR_CODES.err_branch_not_found);

    if (branch?.statistics?.[0] && !isNaN(branch.statistics[0].client_visits)) {
      await this.branchRepository.updateOne(
        {
          _id: new Types.ObjectId(branchId),
        },
        {
          client_visits: (branch.statistics[0].client_visits += 1),
        },
      );
    }

    const menu = await this.productCategoryRepository.aggregate([
      {
        $match: {
          status: PRODUCT_CATEGORY_STATUS.ACTIVE,
        },
      },
      {
        $lookup: {
          from: 'products',
          let: {
            categoryId: '$_id',
            branchId: new Types.ObjectId(branchId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$$categoryId', '$categoriesIds'],
                    },
                    {
                      $in: ['$$branchId', '$branchesIds'],
                    },
                    { $eq: ['$build_status', APPROVED_STATUS] },
                    { $eq: ['$release_status', PRODUCTION_STATUS] },
                    { $eq: ['$status', ACTIVE] },
                    { $eq: ['$isDeleted', false] },
                    { $gt: ['$remainingQuantity', 0] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'productgroups',
                localField: 'productGroupsIds',
                foreignField: '_id',
                as: 'groups',
              },
            },
          ],
          as: 'products',
        },
      },
      {
        $match: {
          products: {
            $ne: [],
          },
        },
      },
    ]);

    if (branch?.bestSalesProducts?.length > 0) {
      menu?.['productcategories']?.unshift({
        name: lang == 'ar' ? 'الاكثر مبيعاً' : 'bestSalesCategory',
        products: branch?.bestSalesProducts,
      });
    }

    return {
      ...menu,
      avgProductsPrepTime: +branch?.statistics[0]?.avgProductsPrepTime?.toFixed(),
      avgProductsPrice: +branch?.statistics[0]?.avgProductsPrice?.toFixed(),
    };
  }
}
