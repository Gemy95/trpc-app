import { z } from 'zod';

export const GetOneOrder = z.object({
  orderId: z.string(),
});
