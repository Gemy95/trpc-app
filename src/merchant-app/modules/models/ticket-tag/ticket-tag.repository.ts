import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TicketTag } from '../../../../libs/database/src/lib/models/ticket-tag/ticket-tag.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class TicketTagRepository extends BaseRepository<TicketTag> {
  constructor(
    @InjectModel(TicketTag.name)
    private readonly nModel: Model<TicketTag>,
  ) {
    super(nModel);
  }
}
