import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ORDER_STATUS } from '../common/constants/order.constants';
import { ProductRepository, DiscountRepository, OrderRepository } from '../models';

@Injectable()
export class CronsService {
  constructor(
    private productRepository: ProductRepository,
    private discountRepository: DiscountRepository,
    private orderRepository: OrderRepository,
  ) {}

  @Cron('0 0 * * *') //Cron job every day at midnight
  async handleCronForUpdatingProductremainingQuantity() {
    await this.productRepository._model.updateMany(
      {},
      [
        {
          $set: {
            remainingQuantity: '$quantity',
          },
        },
      ],
      { multi: true },
    );
  }

  @Cron('0 0 * * *') //Cron job every day at midnight
  async handleCronForUpdatingProductDiscountStatus() {
    await this.discountRepository._model.updateMany({ endDate: { $lte: new Date() } }, { isActive: false });
  }

  @Cron('0 0 * * *') //Cron job every day at midnight
  async handleCronForUpdatingOrdersFromAcceptedToDeliverd() {
    await this.orderRepository._model.updateMany(
      {
        status: ORDER_STATUS.ORDER_ACCEPTED_STATUS,
      },
      [
        {
          $set: {
            status: ORDER_STATUS.ORDER_DELIVERED_STATUS,
          },
        },
      ],
      { multi: true },
    );
  }
}
