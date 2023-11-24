import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  ORDER_PENDING_STATUS,
  ORDER_EXPIRED_STATUS,
  ORDER_ACCEPTED_STATUS,
  ORDER_DELIVERED_STATUS,
  ORDER_READY_STATUS,
} from '../common/constants/order.constants';
import { OrderRepository } from '../models';
import { Types } from 'mongoose';
import {
  ORDER_QUEUE,
  CREATE_ORDER_PROCESSOR,
  ACCEPT_ORDER_PROCESSOR,
  READY_ORDER_PROCESSOR,
} from '../common/constants/queue.constants';

@Processor(ORDER_QUEUE)
export class OrderProcessor {
  constructor(private readonly OrderRepository: OrderRepository) {}

  @Process(CREATE_ORDER_PROCESSOR)
  async handleCreateOrder(job: Job) {
    const { _id } = job.data;

    await this.OrderRepository.updateOne(
      { _id: new Types.ObjectId(_id), status: ORDER_PENDING_STATUS },
      { status: ORDER_EXPIRED_STATUS },
      { lean: true },
    );
  }

  @Process(ACCEPT_ORDER_PROCESSOR)
  async handleAcceptOrder(job: Job) {
    const { _id } = job.data;

    await this.OrderRepository.updateOne(
      { _id: new Types.ObjectId(_id), status: ORDER_ACCEPTED_STATUS },
      { status: ORDER_DELIVERED_STATUS },
      { lean: true },
    );
  }

  @Process(READY_ORDER_PROCESSOR)
  async handleReadyOrder(job: Job) {
    const { _id } = job.data;

    await this.OrderRepository.updateOne(
      { _id: new Types.ObjectId(_id), status: ORDER_READY_STATUS },
      { status: ORDER_DELIVERED_STATUS },
      { lean: true },
    );
  }
}
