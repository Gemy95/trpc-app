import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { Bank, BankSchema, BankRepository } from '../models';
import { MongooseModule } from '@nestjs/mongoose';
import { BankResolver } from './bank.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }])],
  providers: [BankService, BankRepository, BankResolver],
  exports: [BankService, BankRepository],
})
export class BankModule {}
