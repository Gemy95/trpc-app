import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';

import { Branch } from '../../../../libs/database/src/lib/models/branch/branch.schema';
import { FindAllBranchDto } from '../../branch/dto/find-all-filter.dto';
import { GetAllNearByDto, GetAllNearByFilterObject } from '../../branch/dto/get-all-nearby-with-filters.dto';
import { GetAllNearestDto } from '../../branch/dto/get-all-nearest-with-filter.dto';
import { MerchantBranchesDto } from '../../branch/dto/merchant-branches-query.dto';
import { BRANCH_STATUS, BRANCH_STATUS_TAGS, VISIBILITY_STATUS } from '../../common/constants/branch.constants';
import { MERCHANT_STATUS } from '../../common/constants/merchant';
import { ORDER_IN_PROGRESS_STATUS, ORDER_PENDING_STATUS } from '../../common/constants/order.constants';
import {
  APPROVED_STATUS as PRODUCT_APPROVE_STATUS,
  PRODUCTION_STATUS as PRODUCT_PRODUCTION_STATUS,
} from '../../common/constants/product';
import { RESERVATION_STATUS } from '../../common/constants/reservation.constants';
import { ACTIVE } from '../../common/constants/status.constants';
import generateCustomSearch from '../../common/utils/build-custom-search-query';
import generateFilters from '../../common/utils/generate-filters';
import generatePagination from '../../common/utils/generate-pagination';
import { BaseRepository } from '../BaseRepository';
import { MerchantEmployeeRepository } from '../merchant-employee/merchant-employee.repository';
import { SettingRepository } from '../setting/setting.repository';

@Injectable()
export class BranchRepository extends BaseRepository<Branch> {
  constructor(
    @InjectModel(Branch.name) private readonly nModel: Model<Branch>,
    private readonly settingRepository: SettingRepository,
    private merchantEmployeeRepository: MerchantEmployeeRepository,
  ) {
    super(nModel);
  }

  async getAllBranches(query) {
    const { longitude, latitude, limit, order, page, sortBy } = query;
    let { minDistance, maxDistance } = query;

    const distance = await this.settingRepository.getOne({ modelName: 'Branch' });
    minDistance = minDistance && minDistance >= 0 ? minDistance : distance?.minDistance || 0;
    maxDistance = maxDistance && maxDistance > 0 ? maxDistance : distance?.maxDistance || 25000;

    return this.nModel
      .find({
        visibility_status: VISIBILITY_STATUS.ONLINE_STATUS,
        status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
        status: BRANCH_STATUS.APPROVED_STATUS,
        isFreezing: false,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
            $minDistance: minDistance,
          },
        },
      })
      .skip(limit && limit * page && page)
      .limit(limit && limit)
      .sort({ [sortBy]: order })
      .populate('merchantId');
  }

  async getBranchDetails(branchId: string, merchantId: string) {
    const [branch] = await this.nModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(branchId),
          merchantId: new mongoose.Types.ObjectId(merchantId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city',
        },
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'branchId',
          as: 'orders',
        },
      },
      {
        $lookup: {
          from: 'orders',
          as: 'active_orders',
          let: { branchId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$branchId', '$$branchId'] },
                    {
                      $in: ['$status', [ORDER_PENDING_STATUS, ORDER_IN_PROGRESS_STATUS]],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          as: 'clients_orders',
          let: { clients_orders: '$orders.clientId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', '$$clients_orders'] }, { $eq: ['$type', 'Client'] }],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'tables',
          localField: '_id',
          foreignField: 'branchId',
          as: 'tables',
        },
      },
      {
        $lookup: {
          from: 'reservations',
          as: 'waiting_reservations',
          let: { branchId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$branch', '$$branchId'] },
                    { $eq: ['$isWaitingList', true] },
                    {
                      $in: [
                        '$status',
                        [RESERVATION_STATUS.RESERVATION_PENDING_STATUS, RESERVATION_STATUS.RESERVATION_WAITING_STATUS],
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          search: 1,
          mobile: 1,
          address: 1,
          cityId: 1,
          city: 1,
          merchantId: 1,
          ownerId: 1,
          uuid: 1,
          visibleToClients: 1,
          status: 1,
          status_tags: 1,
          visibility_status: 1,
          notes: 1,
          isFreezing: 1,
          location: 1,
          locationDelta: 1,
          workingHours: 1,
          reservationsDays: 1,
          reservationsSettings: 1,
          reservationsInstructions: 1,
          pickupInstructions: 1,
          deliveryInstructions: 1,
          translation: 1,
          isDeleted: 1,
          client_visits: 1,
          createdAt: 1,
          updatedAt: 1,
          total_orders_count: { $size: '$orders' },
          total_active_orders_count: { $size: '$active_orders' },
          total_clients_count: { $size: '$clients_orders' },
          total_orders_amount: { $size: '$orders' }, // need updateeeeeeeeeeeeeeeeeeeeeeeeeeee
          branchGroup: 1,
          inReview: 1,
          self_delivery: 1,
          store_delivery_fee: 1,
          fees_delivery_per_kilometer: 1,
          totalTablesCount: {
            $cond: { if: { $isArray: '$tables' }, then: { $size: '$tables' }, else: 0 },
          },
          // totalWaitingListReservationsCount: { $size: '$waiting_reservations' },
        },
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    // const totalTablesCount = branch?.totalTablesCount || 0;
    // const reservationsDays = branch?.reservationsDays;
    // const reservationsSettings = branch?.reservationsSettings;
    // const separationTimeBetweenEachReservation = reservationsSettings?.separationTimeBetweenEachReservation || 0;
    // const mappedReservationsDays = reservationsDays?.map(ele => {
    //   const dayDurationAsHours = ele?.workingHours?.reduce((total, item) => total + parseFloat(item.to) - parseFloat(item.from), 0);
    //   const separationTimeAsHours = separationTimeBetweenEachReservation / 60;
    //   const expectedReservationsCount = totalTablesCount * dayDurationAsHours; // as 100%
    //   const actualReservationsCount = totalTablesCount * (dayDurationAsHours - separationTimeAsHours); // as what percentage ?
    //   const coverageDay = (actualReservationsCount * 100) / expectedReservationsCount;
    //   return {
    //     ...ele,
    //     coverageDay,
    //   };
    // });

    return branch;
  }

  async findAll(merchantId: string, query: FindAllBranchDto, user?: any) {
    const { limit = 25, page = 0, search, ...rest } = query;

    const generatedMatch = generateFilters(rest);
    const generatedSearch = search ? generateCustomSearch(search, ['name', 'translation.name']) : {};

    const employeeMatchQuery = {};
    if (user?.type === 'MerchantEmployee' /*&& user['branches']?.length >= 1*/) {
      const branchesIds = (await this.merchantEmployeeRepository.getOne({ _id: user?._id }))?.branchesIds || [];
      employeeMatchQuery['_id'] = {
        $in: branchesIds, //user?.['branches']?.map(branch => new mongoose.Types.ObjectId(branch._id)),
      };
    }

    if (generatedMatch['cities']) {
      delete Object.assign(generatedMatch, {
        'city._id': generatedMatch['cities'],
      })['cities'];
    }

    const result = await this.nModel.aggregate([
      {
        $match: {
          ...employeeMatchQuery,
          merchantId: new mongoose.Types.ObjectId(merchantId),
          isFreezing: false,
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city',
        },
      },
      {
        $lookup: {
          from: 'orders',
          as: 'orders',
          let: { branchId: '$_id' },
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
        $lookup: {
          from: 'users',
          let: { localFieldBranchId: '$_id' },
          as: 'employees',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: [['$$localFieldBranchId'], ['$branchesIds']] },
                    {
                      $eq: ['$merchantId', new mongoose.Types.ObjectId(merchantId)],
                    },
                    //{ $eq: ['$isDeleted', false] },
                    { $eq: ['$type', 'MerchantEmployee'] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'orders',
          as: 'active_orders',
          let: { branchId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$branchId', '$$branchId'] },
                    {
                      $in: ['$status', [ORDER_PENDING_STATUS, ORDER_IN_PROGRESS_STATUS]],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...generatedMatch,
          ...generatedSearch,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          search: 1,
          mobile: 1,
          address: 1,
          cityId: 1,
          merchantId: 1,
          ownerId: 1,
          uuid: 1,
          visibleToClients: 1,
          status: 1,
          status_tags: 1,
          visibility_status: 1,
          notes: 1,
          isFreezing: 1,
          location: 1,
          locationDelta: 1,
          workingHours: 1,
          reservationHours: 1,
          reservationsInstructions: 1,
          pickupInstructions: 1,
          deliveryInstructions: 1,
          translation: 1,
          isDeleted: 1,
          client_visits: 1,
          createdAt: 1,
          updatedAt: 1,
          city: 1,
          totalOrdersCount: { $size: '$orders' },
          totalActiveOrdersCount: { $size: '$active_orders' },
          totalBranchEmployeesCount: { $size: '$employees' },
          branchGroup: 1,
          inReview: 1,
          self_delivery: 1,
          store_delivery_fee: 1,
          fees_delivery_per_kilometer: 1,
        },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    const count = result.length;
    const pagesCount = Math.ceil(count / limit) || 1;

    return {
      branches: result,
      page: page || 0,
      pages: pagesCount,
      length: count,
    };
  }

  async getNearestBranches(query: GetAllNearestDto) {
    const { longitude, latitude, categoriesIds, clientId } = query;

    const categoryMatchQuery = {};
    if (categoriesIds?.length >= 1) {
      categoryMatchQuery['merchant.categoriesIds'] = {
        $in: categoriesIds && categoriesIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    const distance = await this.settingRepository.getOne({ modelName: 'Branch' });
    const maxDistance = distance?.maxDistance;

    return this.nModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'dist.calculated',
          maxDistance: maxDistance ?? 5000,
          query: {
            status: BRANCH_STATUS.APPROVED_STATUS,
            status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
          },
          includeLocs: 'dist.location',
          spherical: true,
        },
      },
      {
        $group: {
          _id: '$merchantId',
          branchId: { $first: '$_id' },
          client_visits: { $first: '$client_visits' },
          name: { $first: '$name' },
          translation: { $first: '$translation' },
          location: { $first: '$location' },
          visibility_status: { $first: '$visibility_status' },
          dist: { $first: '$dist' },
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchant_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchant_id'] }, { $in: ['$status', [MERCHANT_STATUS.APPROVED_STATUS]] }],
                },
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'categoriesIds',
                foreignField: '_id',
                as: 'categoriesIds',
              },
            },
            {
              $lookup: {
                from: 'tags',
                let: {
                  tags_id: '$tagsIds',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ['$_id', '$$tags_id'] }, { $eq: ['$client_visibility', true] }],
                      },
                    },
                  },
                ],
                as: 'tagsIds',
              },
            },
            {
              $lookup: {
                from: 'favorites',
                as: 'favorites',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$merchantId', '$$merchant_id'] },
                          { $eq: ['$clientId', new mongoose.Types.ObjectId(clientId) || ''] },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'ratings',
                as: 'ratings',
                let: {
                  merchant_id: '$_id',
                  branch_id: '$branchId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$merchant', '$$merchant_id'] }, { $eq: ['$branchId', '$$branch_id'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'ratingscales',
                      localField: 'rating',
                      foreignField: '_id',
                      as: 'ratingscales',
                    },
                  },
                  {
                    $unwind: {
                      path: '$ratingscales',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                logo: 1,
                name: 1,
                translation: 1,
                productsPriceRange: 1,
                categoriesIds: 1,
                tagsIds: 1,
                isLiked: {
                  $cond: {
                    if: { $eq: ['$favorites', []] },
                    then: false,
                    else: true,
                  },
                },
                rate: { $avg: { $ifNull: ['$ratings.ratingscales.level', 0] } },
              },
            },
          ],
          as: 'merchant',
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          let: {
            merchant_id: '$_id',
            branch_id: '$branchId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$branch_id', '$branchesIds'] },
                    { $eq: ['$merchantId', '$$merchant_id'] },
                    { $eq: ['$build_status', PRODUCT_APPROVE_STATUS] },
                    { $eq: ['$release_status', PRODUCT_PRODUCTION_STATUS] },
                    { $eq: ['$status', ACTIVE] },
                    { $eq: ['$isDeleted', false] },
                  ],
                },
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
                name: 1,
                preparationTime: 1,
                categoriesIds: 1,
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
      {
        $group: {
          _id: '$branchId',
          name: { $first: '$name' },
          translation: { $first: '$translation' },
          visibility_status: { $first: '$visibility_status' },
          location: { $first: '$location' },
          client_visits: { $first: '$client_visits' },
          merchant: { $first: '$merchant' },
          products: { $first: '$products' },
          categories: { $first: '$categories' },
          tags: { $first: '$tags' },
          dist: { $first: '$dist' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          translation: 1,
          location: 1,
          visibility_status: 1,
          client_visits: 1,
          rate: { $trunc: ['$merchant.rate', 2] },
          avgProductsPrice: { $trunc: [{ $avg: '$products.price' }, 0] },
          avgProductsPrepTime: { $trunc: [{ $avg: '$products.preparationTime' }, 0] },
          merchant: {
            _id: 1,
            logo: 1,
            name: 1,
            translation: 1,
            productsPriceRange: 1,
            isLiked: { $ifNull: ['$merchant.isLiked', false] },
          },
          categories: '$merchant.categoriesIds',
          tags: '$merchant.tagsIds',
          dist: 1,
        },
      },
      {
        $match: categoryMatchQuery,
      },
      {
        $sort: { 'dist.calculated': 1 },
      },
      { $limit: 10 },
    ]);
  }

  async getNearByBranches(query: GetAllNearByDto, filters: GetAllNearByFilterObject) {
    const { limit, page, longitude, latitude, clientId, ...rest } = query;
    const generatedMatch = generateFilters(rest);
    const pagination = generatePagination(limit, page);
    const pipelineQuery = [];
    if (generatedMatch['categories']) {
      delete Object.assign(generatedMatch, {
        'categories._id': generatedMatch['categories'],
      })['categories'];
    }
    if (generatedMatch['tags']) {
      delete Object.assign(generatedMatch, {
        'tags._id': generatedMatch['tags'],
      })['tags'];
    }

    // if (filters?.nearest) {
    //   pipelineQuery.push({
    //     $sort: { 'dist.calculated': 1 },
    //   });
    // }

    if (filters?.trending) {
      pipelineQuery.push({
        $sort: {
          client_visits: -1,
        },
      });
    }

    if (filters?.fastest) {
      pipelineQuery.push({
        $sort: {
          avgProductsPrepTime: 1,
        },
      });
    }

    if (query?.price > 0) {
      if (query?.price >= 101) {
        pipelineQuery.push({
          $match: {
            'merchant.productsPriceRange': {
              $gte: +query?.price,
            },
          },
        });
      }
      pipelineQuery.push({
        $match: {
          'merchant.productsPriceRange': {
            $lte: +query?.price,
          },
        },
      });
    }

    const distance = await this.settingRepository.getOne({ modelName: 'Branch' });
    const minDistance = distance?.minDistance;
    const maxDistance = distance?.maxDistance;

    const sortByPrice = filters?.sortByPrice?.toLowerCase() === 'desc' ? -1 : 1;

    const result = await this.nModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'dist.calculated',
          minDistance: minDistance ?? 0,
          maxDistance: maxDistance ?? 25000,
          query: {
            status: BRANCH_STATUS.APPROVED_STATUS,
            status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
          },
          includeLocs: 'dist.location',
          spherical: true,
        },
      },
      {
        $group: {
          _id: '$merchantId',
          branchId: { $first: '$_id' },
          client_visits: { $first: '$client_visits' },
          name: { $first: '$name' },
          translation: { $first: '$translation' },
          location: { $first: '$location' },
          visibility_status: { $first: '$visibility_status' },
          dist: { $first: '$dist' },
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchant_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchant_id'] }, { $eq: ['$status', MERCHANT_STATUS.APPROVED_STATUS] }],
                },
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'categoriesIds',
                foreignField: '_id',
                as: 'categoriesIds',
              },
            },
            {
              $lookup: {
                from: 'tags',
                let: {
                  tags_id: '$tagsIds',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ['$_id', '$$tags_id'] }, { $eq: ['$client_visibility', true] }],
                      },
                    },
                  },
                ],
                as: 'tagsIds',
              },
            },
            {
              $lookup: {
                from: 'favorites',
                as: 'favorites',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$merchantId', '$$merchant_id'] },
                          { $eq: ['$clientId', new mongoose.Types.ObjectId(clientId) || ''] },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'ratings',
                as: 'ratings',
                let: {
                  merchant_id: '$_id',
                  branch_id: '$branchId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$merchant', '$$merchant_id'] }, { $eq: ['$branchId', '$$branch_id'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'ratingscales',
                      localField: 'rating',
                      foreignField: '_id',
                      as: 'ratingscales',
                    },
                  },
                  {
                    $unwind: {
                      path: '$ratingscales',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                logo: 1,
                name: 1,
                translation: 1,
                productsPriceRange: 1,
                categoriesIds: 1,
                tagsIds: 1,
                favorites: 1,
                isLiked: {
                  $cond: {
                    if: { $eq: ['$favorites', []] },
                    then: false,
                    else: true,
                  },
                },
                rate: { $avg: { $ifNull: ['$ratings.ratingscales.level', 0] } },
              },
            },
          ],
          as: 'merchant',
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          let: {
            merchant_id: '$_id',
            branch_id: '$branchId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$branch_id', '$branchesIds'] },
                    { $eq: ['$merchantId', '$$merchant_id'] },
                    { $eq: ['$build_status', PRODUCT_APPROVE_STATUS] },
                    { $eq: ['$release_status', PRODUCT_PRODUCTION_STATUS] },
                    { $eq: ['$status', ACTIVE] },
                    { $eq: ['$isDeleted', false] },
                  ],
                },
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
                name: 1,
                preparationTime: 1,
                categoriesIds: {
                  name: 1,
                  image: 1,
                  translation: 1,
                },
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
      {
        $group: {
          _id: '$branchId',
          name: { $first: '$name' },
          translation: { $first: '$translation' },
          visibility_status: { $first: '$visibility_status' },
          location: { $first: '$location' },
          client_visits: { $first: '$client_visits' },
          merchant: { $first: '$merchant' },
          products: { $first: '$products' },
          categories: { $first: '$categories' },
          tags: { $first: '$tags' },
          dist: { $first: '$dist' },
        },
      },
      { $sort: { 'merchant.productsPriceRange': sortByPrice } },
      ...pipelineQuery,
      {
        $addFields: {
          sortVisiblityStatusField: {
            $switch: {
              branches: [
                { case: { $eq: ['$visibility_status', VISIBILITY_STATUS.ONLINE_STATUS] }, then: 0 },
                { case: { $eq: ['$visibility_status', VISIBILITY_STATUS.BUSY_STATUS] }, then: 1 },
                { case: { $eq: ['$visibility_status', VISIBILITY_STATUS.CLOSED_STATUS] }, then: 2 },
                { case: { $eq: ['$visibility_status', VISIBILITY_STATUS.OFFLINE_STATUS] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          translation: 1,
          location: 1,
          visibility_status: 1,
          client_visits: 1,
          rate: { $trunc: ['$merchant.rate', 2] },
          avgProductsPrice: { $trunc: [{ $avg: '$products.price' }, 0] },
          avgProductsPrepTime: { $trunc: [{ $avg: '$products.preparationTime' }, 0] },
          merchant: {
            _id: 1,
            logo: 1,
            name: 1,
            translation: 1,
            productsPriceRange: 1,
            isLiked: { $ifNull: ['$merchant.isLiked', false] },
          },
          categories: '$merchant.categoriesIds',
          tags: '$merchant.tagsIds',
          dist: 1,
          sortVisiblityStatusField: 1,
        },
      },
      {
        $match: generatedMatch,
      },
      ...pagination,
      {
        $sort: { sortVisiblityStatusField: 1, 'dist.calculated': 1 },
      },
    ]);

    const pagesCount = !isNaN(page) && !isNaN(limit) ? Math.ceil(result?.length / limit) : 1;

    return { branches: result, page: page, pages: pagesCount, length: result?.length };
  }

  public async marketplaceMerchantBranches(merchantId: string, query: MerchantBranchesDto) {
    const { longitude, latitude } = query;

    const distance = await this.settingRepository.getOne({ modelName: 'MarketplaceMerchantBranches' });
    const maxDistance = distance?.maxDistance || 35000;

    let result;
    if (longitude && latitude) {
      result = await this.nModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'dist.calculated',
            maxDistance: maxDistance,
            query: {
              status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
            },
            includeLocs: 'dist.location',
            spherical: true,
          },
        },
        {
          $match: {
            merchantId: new mongoose.Types.ObjectId(merchantId),
            isFreezing: false,
            isDeleted: false,
            status: BRANCH_STATUS.APPROVED_STATUS,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            translation: 1,
            mobile: 1,
            dist: {
              location: 1,
              calculated: { $round: ['$dist.calculated', 2] },
            },
            search: 1,
            address: 1,
            cityId: 1,
            merchantId: 1,
            ownerId: 1,
            visibleToClients: 1,
            status: 1,
            status_tags: 1,
            visibility_status: 1,
            notes: 1,
            isFreezing: 1,
            location: 1,
            locationDelta: 1,
            workingHours: 1,
            reservationHours: 1,
            reservationsInstructions: 1,
            pickupInstructions: 1,
            deliveryInstructions: 1,
            isDeleted: 1,
            client_visits: 1,
            createdAt: 1,
            updatedAt: 1,
            city: 1,
            branchGroup: 1,
            self_delivery: 1,
            store_delivery_fee: 1,
            fees_delivery_per_kilometer: 1,
          },
        },
      ]);
    } else {
      result = await this.nModel.aggregate([
        {
          $match: {
            merchantId: new mongoose.Types.ObjectId(merchantId),
            isFreezing: false,
            status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
            status: BRANCH_STATUS.APPROVED_STATUS,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            translation: 1,
            mobile: 1,
            merchantId: 1,
            location: 1,
            search: 1,
            address: 1,
            cityId: 1,
            ownerId: 1,
            visibleToClients: 1,
            status: 1,
            status_tags: 1,
            visibility_status: 1,
            notes: 1,
            isFreezing: 1,
            locationDelta: 1,
            workingHours: 1,
            reservationHours: 1,
            reservationsInstructions: 1,
            pickupInstructions: 1,
            deliveryInstructions: 1,
            isDeleted: 1,
            client_visits: 1,
            createdAt: 1,
            updatedAt: 1,
            city: 1,
            branchGroup: 1,
            self_delivery: 1,
            store_delivery_fee: 1,
            fees_delivery_per_kilometer: 1,
          },
        },
      ]);
    }
    return result;
  }

  async merchantFirstBranch(merchantId: string) {
    const [branch] = await this._model.aggregate([
      {
        $match: {
          merchantId: new mongoose.Types.ObjectId(merchantId),
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ]);

    return branch;
  }
}
