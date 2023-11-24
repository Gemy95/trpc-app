import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import mongoose, { Types } from 'mongoose';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import {
  MerchantRepository,
  OrderRepository,
  ProductRepository,
  Transaction,
  TransactionRepository,
} from '../../models';
import {
  OrderAcceptedEvent,
  OrderCancelledEvent,
  OrderDeliveredEvent,
  OrderReadyEvent,
  OrderRejectedEvent,
} from '../events/orders.events';

@Injectable()
export class OrderListner {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private merchantRepository: MerchantRepository,
    private productRepository: ProductRepository,
  ) {}
  @OnEvent('orderAccepted')
  async handleOrderAccepted(event: OrderAcceptedEvent) {
    const { amount, from, to, status, tax, commission = 0, orderId } = event;

    const createTransactionDto: Partial<Transaction> = {
      operationId: Date.now().toString().slice(5),
      amount,
      from: new Types.ObjectId(from),
      to: new Types.ObjectId(to),
      status,
      tax,
      commission,
      orderId: new Types.ObjectId(orderId),
    };

    return this.transactionRepository.create(createTransactionDto);
  }

  @OnEvent('orderReady')
  async handleOrderReady(event: OrderReadyEvent) {
    const { status, orderId } = event;
    return this.transactionRepository.updateOne(
      {
        orderId: new Types.ObjectId(orderId),
      },
      {
        status: status,
      },
      { new: true, lean: true },
    );
  }

  @OnEvent('orderDelivered')
  async handleOrderDelivered(event: OrderDeliveredEvent) {
    const { status, orderId, merchantId, orderType, orderInvoice } = event;

    const merchant = await this.merchantRepository.getOne({ _id: new mongoose.Types.ObjectId(merchantId) });

    const merchantCommission = merchant?.commissions?.filter((ele) => {
      return ele?.orderType == orderType;
    });

    let commission = 0;
    if (Array.isArray(merchantCommission) && merchantCommission?.length > 0) {
      commission =
        merchantCommission[0].type == AMOUNT_TYPE.PERCENTAGE
          ? orderInvoice?.charges?.[0]?.amount * (merchantCommission[0].amount / 100) || 0
          : merchantCommission[0].amount || 0;
    }

    return this.transactionRepository.updateOne(
      {
        orderId: new Types.ObjectId(orderId),
      },
      {
        status: status,
        commission: commission,
      },
      { new: true, lean: true },
    );
  }

  @OnEvent('orderCancelled')
  async handleOrderCancelled(event: OrderCancelledEvent) {
    return this.transactionRepository.updateOne(
      {
        status: event.status,
      },
      { new: true, lean: true },
    );
  }

  // no rejected for transaction because rejected after pending order status
  // @OnEvent('orderRejected')
  // async handleOrderRejected(event: OrderRejectedEvent) {
  //   const { orderId, status , rejectedNotes } = event;
  //   return this.transactionRepository.updateOne(
  //     {
  //       orderId: new Types.ObjectId(orderId),
  //     },
  //     {
  //       status: status,
  //       rejectNotes: rejectedNotes
  //     },
  //     { new: true, lean: true },
  //   );
  // }
}
