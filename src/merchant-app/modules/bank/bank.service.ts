import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../common/utils/generate-filters';
import { BankRepository } from '../models';
import { CreateBankDto } from './dto/create-bank.dto';
import { FindAllBankDto } from './dto/findAll-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async create(createBankDto: CreateBankDto) {
    return this.bankRepository.create({
      ...createBankDto,
      country: new mongoose.Types.ObjectId(createBankDto.country),
    });
  }

  async getAll(params: FindAllBankDto) {
    const { limit, page, paginate, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    const banks = await this.bankRepository.aggregate([
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $unwind: {
          path: '$country',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { ...generatedMatch },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    return banks;
  }

  async getOne(id: string) {
    const [bank] = await this.bankRepository._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $unwind: {
          path: '$country',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!bank) {
      throw new NotFoundException(ERROR_CODES.err_bank_not_found);
    }

    return bank;
  }

  async updateOne(id: string, updateBankDto: UpdateBankDto) {
    const bank = await this.bankRepository.getById(id, {});
    if (!bank) {
      throw new NotFoundException(ERROR_CODES.err_bank_not_found);
    }
    return this.bankRepository.updateById(id, updateBankDto, { lean: true, new: true }, {});
  }

  async deleteOne(id: string) {
    const bank = await this.bankRepository.getById(id, {});
    if (!bank) {
      throw new NotFoundException(ERROR_CODES.err_bank_not_found);
    }
    await this.bankRepository.deleteById(id);
    return { success: true };
  }
}
