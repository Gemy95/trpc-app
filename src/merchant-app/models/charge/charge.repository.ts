import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ChargeDocument } from '../../../libs/database/src/lib/models/charge/charge.schema';

@Injectable()
export class ChargeRepository extends BaseRepository<ChargeDocument> {
  constructor(
    @InjectModel('Charge')
    private readonly nModel: Model<ChargeDocument>,
  ) {
    super(nModel);
  }
}
