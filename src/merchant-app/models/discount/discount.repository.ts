import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../BaseRepository';
import { Discount } from '../../../libs/database/src/lib/models/discount/discount.schema';

@Injectable()
export class DiscountRepository extends BaseRepository<Discount> {
  constructor(@InjectModel(Discount.name) private readonly nModel: Model<Discount>) {
    super(nModel);
  }
}
