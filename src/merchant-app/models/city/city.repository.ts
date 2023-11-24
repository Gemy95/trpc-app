import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CityDocument } from '../../../libs/database/src/lib/models/city/city.schema';

@Injectable()
export class CityRepository extends BaseRepository<CityDocument> {
  constructor(
    @InjectModel('City')
    private readonly nModel: Model<CityDocument>,
  ) {
    super(nModel);
  }
}
