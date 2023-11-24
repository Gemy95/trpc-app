import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { TrpcService } from '../trpc/trpc.service';
import { UserService } from './user.service';

@Injectable()
export class UserRouter {
  constructor(private readonly trpcService: TrpcService, private userService: UserService) {}

  listUsers = this.trpcService.publicProcedure
    .meta({ openapi: { method: 'GET', path: '/list' } })
    .input(z.object({}).optional())
    .output(z.array(z.object({ name: z.string(), age: z.number(), mobile: z.string() })).optional())
    .query(({ input }) => {
      return this.userService.listUsers();
    });

  // getUser = this.trpcService.publicProcedure.query(() => {
  //   return this.userService.listUsers()[0];
  // });

  routers = this.trpcService.router({
    list: this.listUsers,
    // get: this.getUser,
  });
}
