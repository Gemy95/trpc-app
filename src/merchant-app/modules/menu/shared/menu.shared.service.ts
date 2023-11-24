import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { APPROVED_STATUS, PRODUCTION_STATUS } from '../../common/constants/product';
import { ACTIVE } from '../../common/constants/status.constants';
import generateCustomSearch from '../../common/utils/build-custom-search-query';
import generateFilters from '../../common/utils/generate-filters';
import {
  BranchRepository,
  MerchantRepository,
  ProductCategoryRepository,
  ProductGroupRepository,
  ProductRepository,
} from '../../models';
import { PRODUCT_CATEGORY_STATUS } from '../../product-category/dto/product-category.enum';
import { MenuFilterDto } from '../dto/menu-filter.dto';

@Injectable()
export class MenuSharedService {
  constructor(
    private readonly merchantRepo: MerchantRepository,
    private readonly productCategoryRepo: ProductCategoryRepository,
    private readonly branchRepo: BranchRepository,
    private readonly productRepo: ProductRepository,
    private readonly productGroupRepo: ProductGroupRepository,
  ) {}

  async getMerchantMenu(user: any, params: MenuFilterDto, lang: string) {
    try {
      const { search, ...rest } = params;
      const generatedMatch = generateFilters(rest);
      const productMatch = {};
      const productCategoryMatch = {};
      const generatedSearch = search
        ? generateCustomSearch(search, ['products.name', 'products.translation.name'])
        : {};

      const merchantId = user?.merchant?._id
        ? user?.merchant?._id
        : user?.type == 'Owner'
        ? await this.merchantRepo.getOne({ ownerId: user?._id })
        : '';

      // if (user?.type === 'MerchantEmployee') {
      //   Object.assign(generatedMatch, {
      //     branch: {
      //       $in: user?.['branches']?.map(branch => new mongoose.Types.ObjectId(branch._id)) || [],
      //     },
      //   });
      // }

      // if (user?.type === 'Owner') {
      //   Object.assign(generatedMatch, {
      //     branch: {
      //       $in: user?.['branches']?.map(branch => new mongoose.Types.ObjectId(branch._id)) || [],
      //     },
      //   });
      // }

      if (generatedMatch['productcategories']) {
        delete Object.assign(productCategoryMatch, {
          _id: generatedMatch['productcategories'],
        })['productcategories'];
      }

      if (generatedMatch['productCategoryStatus']) {
        delete Object.assign(productCategoryMatch, {
          status: generatedMatch['productCategoryStatus'],
        })['productCategoryStatus'];
      }

      if (generatedMatch['status']) {
        delete Object.assign(productMatch, {
          status: generatedMatch['status'],
        })['status'];
      }

      if (generatedMatch['branches']) {
        delete Object.assign(productMatch, {
          'branchesIds._id': generatedMatch['branches'],
        })['branches'];
      }

      if (generatedMatch['productStatus']) {
        delete Object.assign(productMatch, {
          status: generatedMatch['productStatus'],
        })['productStatus'];
      }

      const merchant = await this.merchantRepo.getOne({
        _id: new Types.ObjectId(merchantId),
        isDeleted: false,
      });

      if (!merchant) throw new NotFoundException(ERROR_CODES.err_merchant_not_found);

      const menu = await this.productCategoryRepo._model.aggregate([
        {
          $match: {
            merchantId: new Types.ObjectId(merchantId),
          },
        },
        {
          $lookup: {
            from: 'products',
            let: { productCategoryId: { $toObjectId: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $in: ['$$productCategoryId', '$categoriesIds'] }],
                  },
                },
              },
              {
                $lookup: {
                  from: 'productgroups',
                  let: { productGroupsIds: '$productGroupsIds' },
                  as: 'productGroupsIds',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $in: ['$_id', '$$productGroupsIds'] }],
                        },
                      },
                    },
                    {
                      $sort: {
                        serialDisplayNumber: 1,
                      },
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: 'branches',
                  localField: 'branchesIds',
                  foreignField: '_id',
                  as: 'branchesIds',
                },
              },
              {
                $lookup: {
                  from: 'productcategories',
                  localField: 'categoriesIds',
                  foreignField: '_id',
                  as: 'categoriesIds',
                },
              },
              {
                $lookup: {
                  from: 'orders',
                  let: { productId: { $toObjectId: '$_id' } },
                  as: 'orders',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $in: ['$$productId', '$items.productId'] }],
                        },
                      },
                    },
                    {
                      $project: {
                        items: {
                          $filter: {
                            input: '$items',
                            as: 'item',
                            cond: { $eq: ['$$item.productId', '$$productId'] },
                          },
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  ordersItems: {
                    $reduce: {
                      input: {
                        $concatArrays: ['$orders.items'],
                      },
                      initialValue: [],
                      in: { $setUnion: ['$$this', '$$value'] },
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  preparationTime: 1,
                  productGroupsIds: 1,
                  categoriesIds: 1,
                  merchantId: 1,
                  branchesIds: 1,
                  images: 1,
                  mainImage: 1,
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
                  price: { $toDouble: '$price' },
                  createdAt: 1,
                  updatedAt: 1,
                  numberOfSale: {
                    $toDouble: { $sum: { $ifNull: ['$ordersItems.count', []] } },
                  },
                  totalSalePrice: {
                    $multiply: ['$price', { $toDouble: { $sum: { $ifNull: ['$ordersItems.count', []] } } }],
                  },
                  productGroupsOrders: 1,
                },
              },
              {
                $match: {
                  ...productMatch,
                  ...generatedSearch,
                },
              },
              {
                $sort: {
                  serialDisplayNumber: 1,
                },
              },
            ],
            as: 'products',
          },
        },
        {
          $unwind: {
            path: '$products',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            status: { $first: '$status' },
            merchantId: { $first: '$merchantId' },
            image: { $first: '$image' },
            search: { $first: '$search' },
            translation: { $first: '$translation' },
            isDeleted: { $first: '$isDeleted' },
            serialDisplayNumber: { $first: '$serialDisplayNumber' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            products: { $push: '$products' },
          },
        },
        {
          $match: {
            ...productCategoryMatch,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            status: 1,
            merchantId: 1,
            image: 1,
            search: 1,
            translation: 1,
            isDeleted: 1,
            serialDisplayNumber: 1,
            products: 1,
            createdAt: 1,
            updatedAt: 1,
            total: 1,
          },
        },
        {
          $sort: {
            serialDisplayNumber: 1,
          },
        },
      ]);

      const bestSalesProducts = await this.branchRepo._model.aggregate([
        {
          $match: {
            merchantId: new Types.ObjectId(merchantId),
          },
        },
        {
          $lookup: {
            from: 'orders',
            as: 'orders',
            let: {
              branchId: { $toObjectId: '$_id' },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$branchId', '$$branchId'] }],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            ordersProductsItems: {
              $reduce: {
                input: '$orders.items',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            as: 'productsIntoOrders',
            let: {
              localFieldProductsIds: '$ordersProductsItems.productId',
              localFieldProductsCounts: '$ordersProductsItems.count',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$_id', '$$localFieldProductsIds'] },
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
                  from: 'branches',
                  localField: 'branchesIds',
                  foreignField: '_id',
                  as: 'branchesIds',
                },
              },
              {
                $lookup: {
                  from: 'productgroups',
                  localField: 'productGroupsIds',
                  foreignField: '_id',
                  as: 'productGroupsIds',
                },
              },
              {
                $lookup: {
                  from: 'productcategories',
                  localField: 'categoriesIds',
                  foreignField: '_id',
                  as: 'categoriesIds',
                },
              },
              {
                $project: {
                  _id: 1,
                  count: { $first: '$$localFieldProductsCounts' },
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
                  numberOfSale: {
                    $toDouble: { $sum: { $ifNull: [{ $first: '$$localFieldProductsCounts' }, []] } },
                  },
                  totalSalePrice: {
                    $multiply: [
                      '$price',
                      { $toDouble: { $sum: { $ifNull: [{ $first: '$$localFieldProductsCounts' }, []] } } },
                    ],
                  },
                  productGroupsOrders: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$productsIntoOrders',
        },
        {
          $group: {
            _id: 0,
            products: { $push: '$productsIntoOrders' },
          },
        },
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: '$products._id',
            count: { $sum: '$products.count' },
            name: { $first: '$products.name' },
            description: { $first: '$products.description' },
            preparationTime: { $first: '$products.preparationTime' },
            productGroupsIds: { $first: '$products.productGroupsIds' },
            categoriesIds: { $first: '$products.categoriesIds' },
            merchantId: { $first: '$products.merchantId' },
            branchesIds: { $first: '$products.branchesIds' },
            images: { $first: '$products.images' },
            mainImage: { $first: '$products.mainImage' },
            price: { $first: '$products.price' },
            translation: { $first: '$products.translation' },
            isDeleted: { $first: '$products.isDeleted' },
            build_status: { $first: '$products.build_status' },
            release_status: { $first: '$products.release_status' },
            status: { $first: '$products.status' },
            calories: { $first: '$products.calories' },
            serialDisplayNumber: { $first: '$products.serialDisplayNumber' },
            inReview: { $first: '$products.inReview' },
            discount: { $first: '$products.discount' },
            approvedBy: { $first: '$products.approvedBy' },
            notes: { $first: '$products.notes' },
            mealsTime: { $first: '$products.mealsTime' },
            numberOfSale: { $first: '$products.numberOfSale' },
            totalSalePrice: { $first: '$products.totalSalePrice' },
            productGroupsOrders: { $first: '$products.productGroupsOrders' },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      const productCategoriesCount = menu?.length || 0;
      const productsCount = await this.productRepo.getDocumentsCount({
        merchantId: new mongoose.Types.ObjectId(merchantId),
      });
      const productGroupsCount = await this.productGroupRepo.getDocumentsCount({
        merchantId: new mongoose.Types.ObjectId(merchantId),
      });
      let totalSalesPrice = 0;

      const sortedMenu = menu.map((category) => {
        const sortedProducts = category?.['products']?.map((product) => {
          totalSalesPrice += !isNaN(product?.['totalSalePrice']) ? product?.['totalSalePrice'] : 0;
          const productGroupsOrders = product?.productGroupsOrders?.sort((a, b) => {
            return a?.serialDisplayNumber < b?.serialDisplayNumber
              ? -1
              : a?.serialDisplayNumber > b?.serialDisplayNumber
              ? 1
              : 0;
          });

          const sortedProductGroupsIds = product?.['productGroupsIds']?.map((group) => {
            const sortedOptions = group.options?.sort((a, b) => {
              return a?.serialDisplayNumber < b?.serialDisplayNumber
                ? -1
                : a?.serialDisplayNumber > b?.serialDisplayNumber
                ? 1
                : 0;
            });
            return { ...group, options: sortedOptions };
          });
          return { ...product, productGroupsIds: sortedProductGroupsIds, productGroupsOrders: productGroupsOrders };
        });
        return { ...category, products: sortedProducts };
      });

      if (bestSalesProducts?.length > 0) {
        menu?.unshift({
          name: 'الاكثر مبيعاً',
          translation: [
            {
              _lang: 'en',
              name: 'bestSalesCategory',
            },
          ],
          products: bestSalesProducts,
        });
      }

      return { menu: menu, totalSalesPrice, productCategoriesCount, productsCount, productGroupsCount };
    } catch (error) {
      throw new Error(error);
    }
  }
}
