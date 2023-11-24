import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { FavoriteDocument } from '../../../libs/database/src/lib/models/favorite/favorite.schema';

@Injectable()
export class FavoriteRepository extends BaseRepository<FavoriteDocument> {
  constructor(
    @InjectModel('Favorite')
    private readonly nModel: Model<FavoriteDocument>,
  ) {
    super(nModel);
  }
}
