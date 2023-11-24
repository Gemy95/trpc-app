import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from '../../../../libs/database/src/lib/models/order/order.schema';
import { DraftOrder } from '../../../models';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class DraftOrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectModel(DraftOrder.name)
    private readonly nModel: Model<DraftOrder>,
  ) {
    super(nModel);
  }
}
