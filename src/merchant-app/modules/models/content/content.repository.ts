import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Content } from '../../../../libs/database/src/lib/models/content/content.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ContentRepository extends BaseRepository<Content> {
  constructor(
    @InjectModel('Content')
    private readonly nModel: Model<Content>,
  ) {
    super(nModel);
  }
}
