import { INestApplication, Injectable } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

import { UserRouter } from '../user/user.router';
import { createContext } from './context';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouterService {
  constructor(private readonly trpcService: TrpcService, private readonly userRouter: UserRouter) {}

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
