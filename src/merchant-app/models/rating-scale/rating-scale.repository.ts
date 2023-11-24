import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RatingScale } from '../../../libs/database/src/lib/models/rating-scale/rating-scale.schema';

@Injectable()
export class RatingScaleRepository extends BaseRepository<RatingScale> {
  constructor(
    @InjectModel(RatingScale.name)
    private readonly nModel: Model<RatingScale>,
  ) {
    super(nModel);
  }
}
