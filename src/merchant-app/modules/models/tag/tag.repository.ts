import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { TagDocument } from '../../../../libs/database/src/lib/models/tag/tag.schema';
import generatePagination from '../../common/utils/generate-pagination';
import { GetAllClientTagDto } from '../../tag/dto/get-all-client-tag.dto';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class TagRepository extends BaseRepository<TagDocument> {
  constructor(
    @InjectModel('Tag')
    private readonly nModel: Model<TagDocument>,
  ) {
    super(nModel);
  }

  async getAllClientTags(query: GetAllClientTagDto, categoriesIds) {
    let { limit, page } = query;

    const categoryMatchQuery = {
      client_visibility: true,
    };
    if (categoriesIds?.length > 0) {
      categoryMatchQuery['category'] = {
        $in: categoriesIds?.map((item) => new mongoose.Types.ObjectId(item.categoryId)),
      };
    }

    const pagination = generatePagination(limit, page);

    const result = await this.nModel.aggregate([
      {
        $match: categoryMatchQuery,
      },
      ...pagination,
    ]);

    const count = await this.nModel.count(categoryMatchQuery);

    const pagesCount = !isNaN(page) && !isNaN(limit) ? Math.ceil(count / limit) : 1;

    return { tags: result, page: page, pages: pagesCount, length: result?.length };
  }
}