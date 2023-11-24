import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
export const t = initTRPC.context<Context>().create();

export const isAuthenticated = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
