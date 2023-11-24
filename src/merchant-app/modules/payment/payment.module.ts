import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from '../config/configuration.module';
import { PaytabsTransaction, PaytabsTransactionRepository, PaytabsTransactionSchema } from '../models';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forFeature([{ name: PaytabsTransaction.name, schema: PaytabsTransactionSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaytabsTransactionRepository],
  exports: [PaymentService],
})
export class PaymentModule {}
