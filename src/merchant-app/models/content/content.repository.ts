import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Content } from '../../../libs/database/src/lib/models/content/content.schema';

@Injectable()
export class ContentRepository extends BaseRepository<Content> {
  constructor(
    @InjectModel('Content')
    private readonly nModel: Model<Content>,
  ) {
    super(nModel);
  }
}
