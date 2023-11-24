import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CountryDocument } from '../../../libs/database/src/lib/models/country/country.schema';

@Injectable()
export class CountryRepository extends BaseRepository<CountryDocument> {
  constructor(
    @InjectModel('Country')
    private readonly nModel: Model<CountryDocument>,
  ) {
    super(nModel);
  }
}
