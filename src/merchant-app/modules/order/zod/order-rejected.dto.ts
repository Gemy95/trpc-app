import { z } from 'zod';

export const DashboardOrderRejectDto = z.object({
  rejectedNotes: z.array(z.string()).optional().nullish(),
  outOfStockProductsIds: z.array(z.string()).optional().nullish(),
});
