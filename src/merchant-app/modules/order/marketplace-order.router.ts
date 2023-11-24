import { Injectable, StreamableFile } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketplaceOrderService } from './marketplace-order.service';
import { EstimateStoreOrderFeesDto } from './zod/client-estimate-store-order-fees.dto';
import { GetAllClientHistoryDto } from './zod/create-client-order-history.dto';
import { CreateOrderDto } from './zod/create-order.dto';
import { findAllOrderQueryDto } from './zod/find-all-order.dto';

@Injectable()
export class MarketplaceOrderRouter {
  constructor(private readonly OrderService: MarketplaceOrderService, private readonly trpcService: TrpcService) {}

  create = this.trpcService.protectedProcedure.input(CreateOrderDto).mutation((opts) => {
    let { ctx, input } = opts;
    const parsedInput = CreateOrderDto.parse(input);
    return this.OrderService.create(parsedInput, ctx.user, ctx.language);
  });

  findAll = this.trpcService.protectedProcedure.input(findAllOrderQueryDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = findAllOrderQueryDto.parse(input);
    return this.OrderService.findAll(ctx.user, parsedInput);
  });

  cancel = this.trpcService.protectedProcedure.input(String).mutation((opts) => {
    let { ctx, input } = opts || {};
    return this.OrderService.cancelOrder(input, ctx.user);
  });

  findLastOrder = this.trpcService.protectedProcedure.query((opts) => {
    let { ctx } = opts;
    return this.OrderService.findLastOrder(ctx.user);
  });

  chargesOrderFees = this.trpcService.protectedProcedure.input(EstimateStoreOrderFeesDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = EstimateStoreOrderFeesDto.parse(input);
    return this.OrderService.chargesOrderFees(ctx.user, parsedInput);
  });

  findOne = this.trpcService.protectedProcedure.input(String).query((opts) => {
    let { ctx, input } = opts;
    return this.OrderService.findOne(input, ctx.user);
  });

  getClientOrderingHistory = this.trpcService.protectedProcedure.input(GetAllClientHistoryDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = GetAllClientHistoryDto.parse(input);
    return this.OrderService.getClientOrderingHistory(ctx.user, parsedInput);
  });

  invoice = this.trpcService.protectedProcedure.input(String).query(async (opts) => {
    let { ctx, input } = opts;
    let buffer,
      lang = ctx?.language;
    // need to read language
    if (lang === 'ar') {
      buffer = await this.OrderService.generateArabicInvoice({ id: input });
    } else {
      buffer = await this.OrderService.generateEnglishInvoice(input);
    }
    return new StreamableFile(buffer);
  });

  routers = this.trpcService.router({
    create: this.create,
    findAll: this.findAll,
    cancel: this.cancel,
    findLastOrder: this.findLastOrder,
    chargesOrderFees: this.chargesOrderFees,
    findOne: this.findOne,
    getClientOrderingHistory: this.getClientOrderingHistory,
    invoice: this.invoice,
  });
}
