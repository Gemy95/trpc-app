import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryDocument } from '../../../libs/database/src/lib/models/category/category.schema';
// import { GetAllClientCategoryDto } from '../../category/dto/get-all-client-category.dto';
import generatePagination from '../../modules/common/utils/generate-pagination';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel('Category')
    private readonly nModel: Model<CategoryDocument>,
  ) {
    super(nModel);
  }

  // async getAllClientCategories(query: GetAllClientCategoryDto) {
  //   const { limit, page } = query;

  //   const pagination = generatePagination(limit, page);

  //   const result = await this.nModel.aggregate([
  //     {
  //       $lookup: {
  //         from: 'tags',
  //         foreignField: 'category',
  //         localField: '_id',
  //         as: 'tags',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'merchants',
  //         foreignField: 'categoriesIds',
  //         localField: '_id',
  //         as: 'merchants',
  //       },
  //     },
  //     {
  //       $match: {
  //         client_visibility: true,
  //         'tags.client_visibility': true,
  //         'tags.status': 'active',
  //         tags: {
  //           $ne: [],
  //         },
  //         merchants: {
  //           $ne: [],
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         name: 1,
  //         status: 1,
  //         image: 1,
  //         stores_visibility: 1,
  //         client_visibility: 1,
  //         translation: 1,
  //         createdAt: 1,
  //         updatedAt: 1,
  //         tags: 1,
  //       },
  //     },
  //     ...pagination,
  //   ]);

  //   const count = await this.nModel.count({ client_visibility: true });

  //   const pagesCount =
  //     !isNaN(page) && !isNaN(limit) ? Math.ceil(count / limit) : 1;

  //   return {
  //     categories: result,
  //     page: page,
  //     pages: pagesCount,
  //     length: result?.length,
  //   };
  // }
}
