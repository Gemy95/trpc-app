import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { ContentType } from '../models';
import { ContentRepository } from '../models/content/content.repository';
import { CreateContentDto, QueryContentDto, UpdateContentDto } from './dtos/content.dto';

@Injectable()
export class ContentService {
  constructor(private readonly contentRepository: ContentRepository) {}

  /** Get Content */
  async find(contentType?: QueryContentDto) {
    const result = await this.contentRepository.getAll(contentType?.content_type ? contentType : {}, {
      returnType: 'else',
    });
    return result;
  }

  /** Creating Content */
  async create(contentDto: CreateContentDto) {
    try {
      // check if content_type exist
      const checkResult = await this.contentRepository.getOne({ content_type: contentDto.content_type });
      if (checkResult) {
        return {
          success: false,
          message: ERROR_CODES.err_content_type_exist,
          error: ERROR_CODES.err_content_type_exist,
        };
      }
      const result = await this.contentRepository.create(contentDto);
      return {
        success: true,
        content: result,
      };
    } catch (error) {
      if (error?.code === 11000) {
        throw new HttpException('conflict', HttpStatus.CONFLICT);
      }
    }
  }

  /** Updating Content */
  async update(_id: string, contentDto: UpdateContentDto) {
    const checkResult = await this.contentRepository.getOne({ _id });
    if (!checkResult) {
      return {
        success: false,
        error: ERROR_CODES.err_content_not_found,
      };
    }
    const result = await this.contentRepository.updateOne({ _id }, contentDto, { new: true });
    return result;
  }

  /** Removing Content */
  async remove(_id: string) {
    const checkResult = await this.contentRepository.getOne({ _id });
    if (!checkResult) {
      return {
        success: false,
        error: ERROR_CODES.err_content_not_found,
      };
    }
    return this.contentRepository.deleteOne({ _id });
  }
}
