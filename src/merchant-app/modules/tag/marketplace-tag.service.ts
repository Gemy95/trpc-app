import { Injectable } from '@nestjs/common';
import { TagRepository } from '../models/tag/tag.repository';
import { GetAllClientTagDto } from './dto/get-all-client-tag.dto';

@Injectable()
export class MarketPlaceTagService {
  constructor(private readonly tagRepo: TagRepository) {}

  async getAll(query: GetAllClientTagDto, categoriesIds) {
    return this.tagRepo.getAllClientTags(query, categoriesIds);
  }
}
