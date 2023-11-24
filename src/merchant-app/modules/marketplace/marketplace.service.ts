import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepository } from '../models';

@Injectable()
export class MarketplaceService {
  constructor(private readonly productRepository: ProductRepository) {}

  merchantMarketplaceImages(branchId: string) {
    const params = {
      page: 0,
      limit: 10,
      sort: {},
      paginate: true,
    };
    params['fields'] = {
      _id: 1,
      images: 1,
    };
    return this.productRepository.getAll(
      {
        branchesIds: {
          $in: [new Types.ObjectId(branchId)],
        },
        images: {
          $ne: [],
        },
        isDeleted: false,
      },
      params,
    );
  }
}
