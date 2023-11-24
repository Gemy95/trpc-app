import { z } from 'zod';

export const MerchantBranchesDto = z.object({
  merchantId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  longitude: z.number().optional().nullish(),
  latitude: z.number().optional().nullish(),
});
