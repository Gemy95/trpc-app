import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionRepository, TransactionSchema } from '../models';
import { OrderListner } from './listners/orders.listner';
import { TransactionsResolver } from './transactions.resolver';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MerchantEmployeeModule,
    ProductModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository, OrderListner, TransactionsResolver],
})
export class TransactionsModule {}
