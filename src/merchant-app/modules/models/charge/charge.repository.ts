import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChargeDocument } from '../../../../libs/database/src/lib/models/charge/charge.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ChargeRepository extends BaseRepository<ChargeDocument> {
  constructor(
    @InjectModel('Charge')
    private readonly nModel: Model<ChargeDocument>,
  ) {
    super(nModel);
  }
}
