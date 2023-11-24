import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { TableRepository } from '../models';
import { GetTablesDto } from './dto/get-tables.dto';

@Injectable()
export class MarketplaceTableService {
  constructor(private readonly tableRepository: TableRepository) {}

  findAll(getTablesDto: GetTablesDto) {
    const { limit, order, page, sortBy, branchId } = getTablesDto;

    return this.tableRepository.getAll(
      { isDeleted: false, branchId: new mongoose.Types.ObjectId(branchId) },
      { limit, page, paginate: true, sort: { [sortBy]: order } },
    );
  }

  async findOne(id: string, branchId: string) {
    const table = await this.tableRepository.getOne(
      { isDeleted: false, _id: new mongoose.Types.ObjectId(id), branchId: new mongoose.Types.ObjectId(branchId) },
      { lean: true },
    );

    if (!table) {
      throw new NotFoundException(ERROR_CODES.err_table_not_found);
    }

    return table;
  }
}
