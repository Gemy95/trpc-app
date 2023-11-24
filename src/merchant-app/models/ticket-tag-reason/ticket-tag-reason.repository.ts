import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { TagReason } from '../../../libs/database/src/lib/models/ticket-tag-reason/ticket-tag-reason.schema';

@Injectable()
export class TagReasonRepository extends BaseRepository<TagReason> {
  constructor(
    @InjectModel(TagReason.name)
    private readonly nModel: Model<TagReason>,
  ) {
    super(nModel);
  }
}
