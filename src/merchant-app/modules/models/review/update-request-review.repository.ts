import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review } from '../../../../libs/database/src/lib/models/review/update-request-review.schema';
import { MERCHANT_REQUEST_TYPES } from '../../common/constants/merchant';
import generateFilters from '../../common/utils/generate-filters';
import { ReviewQuery } from '../../dashboard/dto/review-query.dto';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(
    @InjectModel('Review')
    private readonly nModel: Model<Review>,
  ) {
    super(nModel);
  }

  async findAllRequests(reviewQuery: ReviewQuery) {
    const { limit, page, paginate, sortBy, order, ...rest } = reviewQuery;
    const generatedMatch = generateFilters(rest);
    const generatedMatchMerchant = {};

    if (generatedMatch['cities']) {
      delete Object.assign(generatedMatch, {
        'reference.cityId._id': generatedMatch['cities'],
      })['cities'];
    }

    if (generatedMatch['categories']) {
      delete Object.assign(generatedMatch, {
        'reference.category._id': generatedMatch['categories'],
      })['categories'];
    }

    if (generatedMatch['merchantRequestType']) {
      (generatedMatchMerchant['merchantRequestType'] = generatedMatch['merchantRequestType']),
        delete generatedMatch['merchantRequestType'];
    }

    const result = await this.nModel.aggregate([
      {
        $facet: {
          Merchant: [
            {
              $match: {
                modelName: 'Merchant',
              },
            },
            {
              $match: {
                ...generatedMatchMerchant,
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
                      from: 'categories',
                      localField: 'categoriesIds',
                      foreignField: '_id',
                      as: 'category',
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
          ],
          Product: [
            {
              $match: {
                modelName: 'Product',
              },
            },
            {
              $lookup: {
                from: 'products',
                let: { localmerchant: '$reference' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$$localmerchant', '$_id'] }],
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
          ],
          Branch: [
            {
              $match: {
                modelName: 'Branch',
              },
            },
            // {
            //   $match: {
            //     ...generatedMatchBranch,
            //   },
            // },
            {
              $lookup: {
                from: 'branches',
                let: { localbranch: '$reference' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$$localbranch', '$_id'] }],
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
          ],
        },
      },
      { $project: { result: { $setUnion: ['$Merchant', '$Product', '$Branch'] } } },
      { $unwind: '$result' },
      { $replaceRoot: { newRoot: '$result' } },
      {
        $match: { ...generatedMatch },
      },
      {
        $match:
          generatedMatchMerchant['merchantRequestType'] == MERCHANT_REQUEST_TYPES.BANK_ACCOUNT
            ? {
                merchantRequestType: MERCHANT_REQUEST_TYPES.BANK_ACCOUNT,
              }
            : {},
      },
      {
        $unwind: {
          path: '$reference.cityId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    const count = await this.nModel.countDocuments([
      {
        $facet: {
          Merchant: [
            {
              $match: {
                modelName: 'Merchant',
              },
            },
            {
              $match: {
                ...generatedMatchMerchant,
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
                      from: 'categories',
                      localField: 'categoriesIds',
                      foreignField: '_id',
                      as: 'category',
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
          ],
          Product: [
            {
              $match: {
                modelName: 'Product',
              },
            },
            {
              $lookup: {
                from: 'products',
                let: { localmerchant: '$reference' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$$localmerchant', '$_id'] }],
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
          ],
          Branch: [
            {
              $match: {
                modelName: 'Branch',
              },
            },
            // {
            //   $match: {
            //     ...generatedMatchBranch,
            //   },
            // },
            {
              $lookup: {
                from: 'branches',
                let: { localbranch: '$reference' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$$localbranch', '$_id'] }],
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
          ],
        },
      },
      { $project: { result: { $setUnion: ['$Merchant', '$Product', '$Branch'] } } },
      { $unwind: '$result' },
      { $replaceRoot: { newRoot: '$result' } },
      {
        $match: { ...generatedMatch },
      },
      {
        $match:
          generatedMatchMerchant['merchantRequestType'] == MERCHANT_REQUEST_TYPES.BANK_ACCOUNT
            ? {
                merchantRequestType: MERCHANT_REQUEST_TYPES.BANK_ACCOUNT,
              }
            : {},
      },
      {
        $unwind: {
          path: '$reference.cityId',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const pagesCount = Math.ceil(count / limit) || 1;

    return { reviews: result, page: page, pages: pagesCount, length: count };
  }
}
