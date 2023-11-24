import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CityDocument } from '../../../../libs/database/src/lib/models/city/city.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class CityRepository extends BaseRepository<CityDocument> {
  constructor(
    @InjectModel('City')
    private readonly nModel: Model<CityDocument>,
  ) {
    super(nModel);
  }
}
