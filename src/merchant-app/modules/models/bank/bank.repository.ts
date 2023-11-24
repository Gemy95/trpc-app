import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bank } from '../../../../libs/database/src/lib/models/bank/bank.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class BankRepository extends BaseRepository<Bank> {
  constructor(@InjectModel(Bank.name) private readonly nModel: Model<Bank>) {
    super(nModel);
  }
}
