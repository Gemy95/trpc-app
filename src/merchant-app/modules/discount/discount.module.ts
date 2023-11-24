import { forwardRef, Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from '../models';
import { DiscountRepository } from '../models/discount/discount.repository';
import { ProductModule } from '../product/product.module';
import { DiscountResolver } from './discount.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    forwardRef(() => ProductModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository, DiscountResolver],
  exports: [DiscountRepository],
})
export class DiscountModule {}
