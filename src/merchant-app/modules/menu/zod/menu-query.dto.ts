import { z } from 'zod';

export const MenuQueryDto = z.object({
  merchantId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  params: z.object({ branchId: z.string().regex(/^[0-9a-fA-F]{24}$/) }),
});
