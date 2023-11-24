import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CountryDocument } from '../../../../libs/database/src/lib/models/country/country.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class CountryRepository extends BaseRepository<CountryDocument> {
  constructor(
    @InjectModel('Country')
    private readonly nModel: Model<CountryDocument>,
  ) {
    super(nModel);
  }
}
