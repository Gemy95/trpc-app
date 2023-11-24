import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { Admin } from '../../../libs/database/src/lib/models/admin/admin.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(
    @InjectModel('Admin')
    private readonly nModel: Model<Admin>,
  ) {
    super(nModel);
  }

  async create(data): Promise<Admin> {
    const document = new this.nModel.prototype.constructor(data);
    const admin = await document.save();

    return admin.toObject();
  }

  async updateOne(query, data): Promise<Admin> {
    return this.nModel.findOneAndUpdate(query, data, { new: true }).select({ password: 0 }).lean();
  }
}
