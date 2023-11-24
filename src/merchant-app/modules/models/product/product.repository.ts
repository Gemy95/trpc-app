import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Product } from '../../../../libs/database/src/lib/models/product/product.schema';
import { IPrepareOrder, PRODUCT_APPROVED_STATUS } from '../../common/constants/product';
import { ACTIVE } from '../../common/constants/status.constants';
import generateFilters from '../../common/utils/generate-filters';
import { GetAllProductDto } from '../../product/dto/get-all-product.dto';
import { SearchDto } from '../../search/dto/search-merchant.dto';
import { BaseRepository } from '../BaseRepository';
import { MerchantEmployeeRepository } from '../merchant-employee/merchant-employee.repository';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectModel(Product.name)
    private readonly nModel: Model<Product>,
    private merchantEmployeeRepository: MerchantEmployeeRepository,
  ) {
    super(nModel);
  }

  async getProductsCountByProductCategoryId(productCategoryId: string) {
    return this.nModel.countDocuments({ categoriesIds: { $in: [productCategoryId] } });
  }

  public async getProductsForMerchant(query: GetAllProductDto, merchantId: string, user: any) {
    const { limit, page, search, sortBy, order, ...rest } = query;
    const generatedMatch = generateFilters(rest);
    const generatedSearch = generateFilters({ search });
    const generatedMatch2 = {};

    const employeeMatchQuery = {};
    if (user?.type === 'MerchantEmployee' /*&& user['branches']?.length >= 1*/) {
      const branchesIds = (await this.merchantEmployeeRepository.getOne({ _id: user?._id }))?.branchesIds || [];
      employeeMatchQuery['branchesIds'] = {
        $in: branchesIds, //user?.['branches']?.map(branch => new mongoose.Types.ObjectId(branch._id)),
      };
    }

    if (generatedMatch['categories']) {
      generatedMatch2['categoriesIds'] = generatedMatch['categories'];
      delete Object.assign(generatedMatch, {
        'productCategories._id': generatedMatch['categories'],
      })['categories'];
    }
    if (generatedMatch['branches']) {
      generatedMatch2['branchesIds'] = generatedMatch['branches'];
      delete Object.assign(generatedMatch, { 'branches._id': generatedMatch['branches'] })['branches'];
    }
    const result = await this.nModel.aggregate([
      {
        $match: {
          ...employeeMatchQuery,
          merchantId: new mongoose.Types.ObjectId(merchantId),
          isDeleted: false,
          ...generatedSearch,
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchesIds: '$branchesIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$isDeleted', false] }, { $in: ['$_id', '$$branchesIds'] }],
                },
              },
            },
          ],
          as: 'branches',
        },
      },
      {
        $lookup: {
          from: 'productcategories',
          let: { categoriesIds: '$categoriesIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$isDeleted', false] }, { $in: ['$_id', '$$categoriesIds'] }],
                },
              },
            },
            {
              $sort: {
                serialDisplayNumber: 1,
              },
            },
          ],
          as: 'productCategories',
        },
      },
      {
        $match: generatedMatch,
      },
      {
        $lookup: {
          from: 'productgroups',
          let: { productGroupsIds: '$productGroupsIds' },
          as: 'productGroups',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$isDeleted', false] }, { $in: ['$_id', '$$productGroupsIds'] }],
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
          merchantId: 1,
          branchesIds: 1,
          images: 1,
          mainImage: 1,
          price: { $toDouble: '$price' },
          numberOfSales: {
            $toDouble: { $sum: { $ifNull: ['$ordersItems.count', []] } },
          },
          translation: 1,
          isDeleted: 1,
          build_status: 1,
          release_status: 1,
          status: 1,
          calories: 1,
          createdAt: 1,
          updatedAt: 1,
          serialDisplayNumber: 1,
          mealsTime: 1,
          branches: 1,
          productCategories: 1,
          productGroups: 1,
          totalSalePrice: { $multiply: ['$price', { $toDouble: { $sum: { $ifNull: ['$ordersItems.count', []] } } }] },
          remainingQuantity: 1,
          quantity: 1,
          inReview: 1,
          discount: 1,
        },
      },
      {
        $sort:
          sortBy && order
            ? { [sortBy]: 1 }
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

    const sortedData = result.map((product) => {
      const groups = product?.['productGroups']?.map((group) => {
        const sortedOptions = group?.options?.sort((a, b) => {
          return a?.serialDisplayNumber < b?.serialDisplayNumber
            ? -1
            : a?.serialDisplayNumber > b?.serialDisplayNumber
            ? 1
            : 0;
        });
        return { ...group, options: sortedOptions };
      });
      return { ...product, productGroups: groups };
    });

    const count = await this.nModel.countDocuments({
      ...employeeMatchQuery,
      merchantId: new mongoose.Types.ObjectId(merchantId),
      isDeleted: false,
      ...generatedSearch,
      ...generatedMatch2,
    });

    const pagesCount = Math.ceil(count / limit) || 1;

    return { products: sortedData, page: page, pages: pagesCount, length: count };
  }

  async getProductImages(productId: string) {
    return this.nModel.findOne({ _id: new mongoose.Types.ObjectId(productId) }).select({ images: 1, _id: 0 });
  }

  async getMerchantProductsCount(merchantId) {
    return this.nModel.countDocuments({ merchantId });
  }

  searchProducts(query: SearchDto) {
    const { search } = query;
    const generatedMatch = generateFilters({ search });
    return this.nModel.aggregate([
      {
        $match: {
          build_status: PRODUCT_APPROVED_STATUS,
          status: ACTIVE,
          ...generatedMatch,
        },
      },
    ]);
  }

  async prepareOrder(orderDto): Promise<IPrepareOrder[]> {
    const groups = [];
    const options = [];
    const products = [];
    orderDto.items.forEach((item) => {
      products.push(new mongoose.Types.ObjectId(item.productId));
      item.groups?.forEach((group) => {
        groups.push(new mongoose.Types.ObjectId(group.productGroupId));
        group.options?.forEach((option) => options.push(new mongoose.Types.ObjectId(option._id)));
      });
    });

    return (await this._model.aggregate([
      {
        $match: {
          _id: {
            $in: products,
          },
        },
      },
      {
        $lookup: {
          from: 'productgroups',
          let: { groups, options },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', '$$groups'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                options: {
                  $filter: {
                    input: '$options',
                    as: 'option',
                    cond: { $in: ['$$option._id', options] },
                  },
                },
              },
            },
          ],

          as: 'groups',
        },
      },
      {
        $lookup: {
          from: 'discounts',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      { $unwind: { path: '$discount', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          groups: {
            _id: 1,
            options: 1,
          },
          preparationTime: 1,
          price: 1,
          discount: 1,
        },
      },
    ])) as unknown as IPrepareOrder[];
  }
}
