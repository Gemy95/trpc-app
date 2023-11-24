import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { TransactionRepository } from '../models';
import { GetAllTransactionDto } from './dtos/get-all-transaction.dto';
import { TransactionQueryDto } from './dtos/transaction-query.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async findAll(query: TransactionQueryDto) {
    return this.transactionRepository.findAll(query);
  }

  async findAllByMerchantId(getAllTransactionDto: GetAllTransactionDto, user: any) {
    return this.transactionRepository.getAllTransactionsByMerchantId(getAllTransactionDto, user);
  }

  async findOne(transactionId: string) {
    return this.transactionRepository.getTransactionById(transactionId);
  }

  async update(transactionId: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.getOne({
      _id: new Types.ObjectId(transactionId),
      isDeleted: false,
    });
    if (!transaction) throw new NotFoundException(ERROR_CODES.err_transaction_not_found);
    const updatedTransaction = await this.transactionRepository.updateOne(
      {
        _id: new Types.ObjectId(transactionId),
        isDeleted: false,
      },
      updateTransactionDto,
      { new: true },
    );

    if (!updatedTransaction)
      throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'transaction'));

    return updatedTransaction;
  }
}
