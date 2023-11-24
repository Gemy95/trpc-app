import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OneSignalDocument } from '../../../../libs/database/src/lib/models/one-signal/oneSignal.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class OneSignalRepository extends BaseRepository<OneSignalDocument> {
  constructor(
    @InjectModel('OneSignal')
    private readonly nModel: Model<OneSignalDocument>,
  ) {
    super(nModel);
  }

  async getMerchantUUIDs(order: any) {
    return this._model.find({
      branchId: order._id,
      isActive: true,
    });
  }

  async getOperationUUIDs() {
    return this._model.find({
      isAdmin: true,
      isActive: true,
    });
  }
}
