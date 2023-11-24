import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ShoppexEmployee } from '../../../libs/database/src/lib/models/shoppex-employee/shoppex-employee.schema';

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
