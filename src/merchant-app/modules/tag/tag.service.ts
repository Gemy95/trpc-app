import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../common/utils/generate-filters';
import { CategoryRepository, TagDocument, TagRepository } from '../models';
import { TagDto, UpdateTagDto } from './dto/tag.dto';
import { TagQueryDto } from './dto/tagQuery.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository, private readonly categoryRepo: CategoryRepository) {}

  async create(categoryId, createDto: TagDto): Promise<TagDocument> {
    const category = await this.categoryRepo.getById(categoryId, {});
    if (!category) {
      throw new NotFoundException(ERROR_CODES.err_category_not_found);
    }

    if (category.status === 'inActive') {
      throw new BadRequestException(ERROR_CODES.err_category_status_inactive);
    }

    return this.tagRepository.create({ category: categoryId, ...createDto });
  }

  getAllByCategoryId(categoryId: string, params: TagQueryDto) {
    const { limit, page, paginate, sort } = params;
    const query = { category: categoryId };

    if (params.search) {
      query['search'] = {
        $in: params.search.split(' ').map((s) => new RegExp(s, 'i')),
      };
    }

    if (params.status) {
      query['status'] = params.status;
    }

    return this.tagRepository.getAll(query, { limit, page, paginate, sort });
  }

  async getOne(categoryId: string, id: string) {
    const tag = await this.tagRepository.getOne({ _id: id, category: categoryId }, {});
    if (!tag) {
      throw new NotFoundException(ERROR_CODES.err_tag_not_found);
    }
    return tag;
  }

  async updateOne(categoryId: string, id: string, updateDto: UpdateTagDto) {
    const tag = await this.tagRepository.getOne({ _id: id, categoryId: categoryId }, {});
    if (!tag) {
      throw new NotFoundException(ERROR_CODES.err_tag_not_found);
    }
    return this.tagRepository.updateById(id, updateDto, { new: true }, {});
  }

  async deleteOne(categoryId: string, id: string) {
    try {
      const tag = await this.tagRepository.getOne({ _id: id, category: categoryId }, {});
      if (!tag) {
        // TODO Review Later, shouldn't throw an error any more since graphql will throw an error as well!
        // throw new NotFoundException(ERROR_CODES.err_tag_not_found);
        throw new NotFoundException(ERROR_CODES.err_tag_not_found);
      }
      const result = await this.tagRepository.deleteById(id);
      return { success: true, result, message: 'success' };
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_delete_tag);
    }
  }

  async find(query: TagQueryDto) {
    const { limit, page, paginate, sort, search, ...rest } = query;
    const generatedMatch = generateFilters(rest);
    const generatedSearch = generateFilters({ search });

    if (generatedMatch['categories']) {
      delete Object.assign(generatedMatch, {
        'category._id': generatedMatch['categories'],
      })['categories'];
    }

    if (generatedMatch['client_visibility']) {
      Object.assign(generatedMatch, {
        client_visibility: generatedMatch['client_visibility'],
      });
    }

    if (generatedMatch['stores_visibility']) {
      Object.assign(generatedMatch, {
        stores_visibility: generatedMatch['stores_visibility'],
      });
    }

    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
        },
      },
      {
        $match: {
          ...generatedMatch,
          ...generatedSearch,
        },
      },
    ];

    const result = await this.tagRepository.aggregate(pipeline, {
      limit,
      page,
      paginate,
      sort,
    });

    return result;
  }
}
