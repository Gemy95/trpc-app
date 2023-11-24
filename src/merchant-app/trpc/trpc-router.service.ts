import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

import { MarketPlaceCategoryRouter } from '../modules/category/marketplace-category.router';
import { ClientRouter } from '../modules/client/client.router';
import { ClientMenuRouter } from '../modules/menu/client-menu.router';
import { MarketplaceOrderDraftRouter } from '../modules/order/marketplace-order-draft.router';
import { MarketplaceOrderRouter } from '../modules/order/marketplace-order.router';
import { MarketplaceProductRouter } from '../modules/product/marketplace-product.router';
import { MarketplaceSearchRouter } from '../modules/search/marketplace-search.router';
import { MarketPlaceTagRouter } from '../modules/tag/marketplace-tag.router';
import { UserRouter } from '../user/user.router';
import { createContext } from './context';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouterService {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly userRouter: UserRouter,
    private readonly clientRouter: ClientRouter,
    private readonly marketPlaceCategoryRouter: MarketPlaceCategoryRouter,
    private readonly marketPlaceTagRouter: MarketPlaceTagRouter,
    private readonly marketplaceProductRouter: MarketplaceProductRouter,
    private readonly clientMenuRouter: ClientMenuRouter,
    private readonly marketplaceSearchRouter: MarketplaceSearchRouter,
    private readonly marketplaceOrderRouter: MarketplaceOrderRouter,
    private readonly marketplaceOrderDraftRouter: MarketplaceOrderDraftRouter,
  ) {}

  appRouter = this.trpcService.router({
    hello: this.trpcService.publicProcedure
      // .meta({ openapi: { method: 'GET', path: '/hello' } })
      .input(z.object({}).optional().nullish())
      .query(() => {
        return {
          greeting: `Hello World`,
        };
      }),
    user: this.userRouter.routers,
    client: this.clientRouter.routers,
    marketplaceCategory: this.marketPlaceCategoryRouter.routers,
    marketplaceTag: this.marketPlaceTagRouter.routers,
    marketplaceProduct: this.marketplaceProductRouter.routers,
    marketplaceMenu: this.clientMenuRouter.routers,
    marketplaceSearch: this.marketplaceSearchRouter.routers,
    marketplaceOrder: this.marketplaceOrderRouter.routers,
    marketplaceOrderDraft: this.marketplaceOrderDraftRouter.routers,
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouterService[`appRouter`];
