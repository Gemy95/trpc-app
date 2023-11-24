import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { Favorite, FavoriteRepository } from '../models';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteQueryDto } from './dtos/get-all-favorite.dto';

@Injectable()
export class MarketplaceFavoriteService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async create(user: any, createFavoriteDto: CreateFavoriteDto) {
    const favouriteIsExists = await this.favoriteRepository.getOne({
      merchantId: new mongoose.Types.ObjectId(createFavoriteDto.merchantId),
      clientId: new mongoose.Types.ObjectId(user._id),
    });

    if (favouriteIsExists) {
      throw new BadRequestException(ERROR_CODES.err_favorite_already_exists);
    }

    const newFavorite = new Favorite();
    newFavorite.clientId = new mongoose.Types.ObjectId(user._id);
    newFavorite.merchantId = new mongoose.Types.ObjectId(createFavoriteDto.merchantId);
    newFavorite.branchId = createFavoriteDto?.branchId
      ? new mongoose.Types.ObjectId(createFavoriteDto.branchId)
      : undefined;

    const favorite = await this.favoriteRepository.create(newFavorite);

    return { success: true };
  }

  async findAll(user: any, query: FavoriteQueryDto) {
    const { longitude, latitude, page, limit } = query;

    return this.favoriteRepository.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { localFieldMerchantId: { $toObjectId: '$merchantId' } },
          as: 'merchant',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$localFieldMerchantId'],
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
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          as: 'products',
          let: {
            localFieldMerchantId: { $toObjectId: '$merchantId' },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$merchantId', '$$localFieldMerchantId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { localFieldBranchId: { $toObjectId: '$branchId' } },
          as: 'branch',
          pipeline: [
            {
              $geoNear: {
                near: { type: 'Point', coordinates: [longitude || 0, latitude || 0] },
                distanceField: 'dist.calculated',
                includeLocs: 'dist.location',
                spherical: true,
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$localFieldBranchId'],
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
          from: 'categories',
          localField: 'merchant.categoriesIds',
          foreignField: '_id',
          as: 'categoriesIds',
        },
      },
      {
        $lookup: {
          from: 'tags',
          let: {
            tagsIds: '$merchant.tagsIds',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', '$$tagsIds'] }, { $eq: ['$client_visibility', true] }],
                },
              },
            },
          ],
          as: 'tagsIds',
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'ratings',
          as: 'rating',
          let: {
            localFieldMerchantId: { $toObjectId: '$merchantId' },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$merchantId', '$$localFieldMerchantId'] }],
                },
              },
            },
            {
              $lookup: {
                from: 'ratingscales',
                as: 'ratingscale',
                let: {
                  localFieldRatingScaleId: '$rating',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$_id', '$$localFieldRatingScaleId'] }],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      level: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$ratingscale',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$merchant',
                avgOrdersRating: { $avg: { $ifNull: ['$ratingscale.level', 0] } },
                // data: {
                //   $push: '$$ROOT',
                // },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$rating',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          'merchant._id': 1,
          'merchant.name': 1,
          'merchant.description': 1,
          'merchant.commercialRegistrationNumber': 1,
          'merchant.commercialName': 1,
          'merchant.branchesNumber': 1,
          'merchant.hasDeliveryService': 1,
          'merchant.address': 1,
          'merchant.uuid': 1,
          'merchant.build_status': 1,
          'merchant.release_status': 1,
          'merchant.visibility_status': 1,
          'merchant.ownerId': 1,
          'merchant.logo': 1,
          'merchant.identificationImage': 1,
          'merchant.commercialIdImage': 1,
          'merchant.balance': 1,
          'merchant.location': 1,
          'merchant.locationDelta': 1,
          'merchant.notes': 1,
          'merchant.isDeleted': 1,
          'merchant.translation': 1,
          'merchant.categoriesIds': 1,
          'merchant.tagsIds': 1,
          'merchant.cityId': 1,
          'merchant.productsPriceRange': 1,
          'merchant.twitterUrl': 1,
          'merchant.facebookUrl': 1,
          'merchant.websiteUrl': 1,
          'merchant.snapUrl': 1,
          'merchant.tiktokUrl': 1,
          'merchant.mobile': 1,
          'merchant.approvedBy': 1,
          'merchant.inReview': 1,
          'merchant.createdAt': 1,
          'merchant.updatedAt': 1,
          'merchant.rating': 1,
          'merchant.isLiked': { $ifNull: ['$merchant.isLiked', true] },
          avgProductsPrepTime: {
            $avg: { $ifNull: ['$products.preparationTime', []] },
          },
          avgProductsPrice: { $avg: { $ifNull: ['$products.price', []] } },
          avgOrdersRating: { $ifNull: ['$rating.avgOrdersRating', 0] },
          branch: 1,
          dist: '$branch.dist',
          categoriesIds: 1,
          tagsIds: 1,
        },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);
  }

  async deleteOne(user: any, merchantId: string) {
    const favorite = await this.favoriteRepository.getOne({
      merchantId: new mongoose.Types.ObjectId(merchantId),
      clientId: new mongoose.Types.ObjectId(user._id),
    });
    if (!favorite) {
      throw new NotFoundException(ERROR_CODES.err_favorite_not_found);
    }
    await this.favoriteRepository.deleteById(favorite._id);
    return { success: true };
  }
}
