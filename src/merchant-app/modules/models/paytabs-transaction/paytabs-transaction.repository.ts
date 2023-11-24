import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { PaytabsTransaction } from '../../../../libs/database/src/lib/models/paytabs-transaction/paytabs-transaction.schema';
import { ERROR_CODES } from '../../../../libs/utils/src';
import generateFilters from '../../common/utils/generate-filters';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class PaytabsTransactionRepository extends BaseRepository<PaytabsTransaction> {
  constructor(@InjectModel(PaytabsTransaction.name) private readonly nModel: Model<PaytabsTransaction>) {
    super(nModel);
  }
  async createOne(paytabsTransaction: any) {
    return this.create({ ...paytabsTransaction });
  }

  async getAll(params: any) {
    const { limit, page, paginate, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    const paytabsTransactions = await this.aggregate([
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

    return paytabsTransactions;
  }

  async getOne(paytabsTransactionId: string) {
    const [paytabsTransaction] = await this._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(paytabsTransactionId),
        },
      },
    ]);

    if (!paytabsTransaction) {
      throw new NotFoundException(ERROR_CODES.err_payment_paytabs_transaction_not_found);
    }

    return paytabsTransaction;
  }

  async updateOne(paytabsTransactionId: string, updatePaytabsTransactionDto: any) {
    const isPaytabsTransactionExists = await this.getById(new mongoose.Types.ObjectId(paytabsTransactionId), {});
    if (!isPaytabsTransactionExists) {
      throw new NotFoundException(ERROR_CODES.err_payment_paytabs_transaction_not_found);
    }
    return this.updateById(paytabsTransactionId, { ...updatePaytabsTransactionDto }, { lean: true, new: true }, {});
  }

  async remove(paytabsTransactionId: string) {
    const paytabsTransaction = await this.getById(new mongoose.Types.ObjectId(paytabsTransactionId), {});
    if (!paytabsTransaction) {
      throw new NotFoundException(ERROR_CODES.err_payment_paytabs_transaction_not_found);
    }
    await this.deleteById(paytabsTransactionId);
    return { success: true };
  }
}
