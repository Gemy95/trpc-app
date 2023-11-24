import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';

import { isAuthenticated } from './auth.middleware';

@Injectable()
export class TrpcService {
  public trpc = initTRPC.context().meta<OpenApiMeta>().create();
  public publicProcedure;
  public router;
  public mergeRouters;
  public protectedProcedure;

  constructor() {
    this.publicProcedure = this.trpc.procedure;
    this.router = this.trpc.router;
    this.mergeRouters = this.trpc.mergeRouters;
    this.protectedProcedure = this.publicProcedure.use(isAuthenticated);
  }
}
