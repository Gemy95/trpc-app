import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Table } from '../../../../libs/database/src/lib/models/table/table.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class TableRepository extends BaseRepository<Table> {
  constructor(
    @InjectModel(Table.name)
    private readonly nModel: Model<Table>,
  ) {
    super(nModel);
  }

  async capacityOfTables(branchId: string, tablesIds: string[]) {
    const [response] = await this.nModel.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          _id: {
            $in: tablesIds.map((ele) => {
              return new mongoose.Types.ObjectId(ele);
            }),
          },
        },
      },
      { $group: { _id: null, totalCapacity: { $sum: '$capacity' } } },
      { $project: { _id: 0 } },
    ]);

    return response;
  }
}
