import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FavoriteDocument } from '../../../../libs/database/src/lib/models/favorite/favorite.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class FavoriteRepository extends BaseRepository<FavoriteDocument> {
  constructor(
    @InjectModel('Favorite')
    private readonly nModel: Model<FavoriteDocument>,
  ) {
    super(nModel);
  }
}
