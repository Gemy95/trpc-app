import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';

import { ShoppexEmployee } from '../../../../libs/database/src/lib/models/shoppex-employee/shoppex-employee.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class ShoppexEmployeeRepository extends BaseRepository<ShoppexEmployee> {
  constructor(
    @InjectModel('ShoppexEmployee')
    private readonly nModel: Model<ShoppexEmployee>,
  ) {
    super(nModel);
  }

  async create(data): Promise<ShoppexEmployee> {
    const document = new this.nModel.prototype.constructor(data);
    const shoppexEmployee = await document.save();

    return shoppexEmployee.toObject();
  }

  async updateOne(query, data): Promise<ShoppexEmployee> {
    return this.nModel.findOneAndUpdate(query, data, { new: true }).select({ password: 0 }).lean();
  }
}
