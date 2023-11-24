import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketplaceOrderService } from './marketplace-order.service';
import { CreateOrderDto } from './zod/create-order.dto';

@Injectable()
export class MarketplaceOrderDraftRouter {
  constructor(private readonly OrderService: MarketplaceOrderService, private readonly trpcService: TrpcService) {}

  createOrUpdateDraft = this.trpcService.protectedProcedure.input(CreateOrderDto).mutation((opts) => {
    let { ctx, input } = opts;
    const parsedInput = CreateOrderDto.parse(input);
    return this.OrderService.createOrUpdateDraft(parsedInput, ctx.user, ctx.language);
  });

  findOneDraft = this.trpcService.protectedProcedure.input(String).query((opts) => {
    let { ctx, input } = opts;
    return this.OrderService.findOneDraftByBranchId(input, ctx.user);
  });

  deleteOneDraft = this.trpcService.protectedProcedure.input(String).query((opts) => {
    let { ctx, input } = opts;
    return this.OrderService.deleteOneDraftByBranchId(input, ctx.user);
  });

  routers = this.trpcService.router({
    createOrUpdateDraft: this.createOrUpdateDraft,
    findOneDraft: this.findOneDraft,
    deleteOneDraft: this.deleteOneDraft,
  });
}
