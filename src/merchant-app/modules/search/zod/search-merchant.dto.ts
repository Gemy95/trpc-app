import { z } from 'zod';

export const SearchDto = z
  .object({
    search: z.string().optional().nullish().default(undefined),
    product: z.boolean().optional().nullish().default(true),
    merchant: z.boolean().optional().nullish().default(true),
  })
  .optional()
  .nullish()
  .default({
    search: undefined,
    product: true,
    merchant: true,
  });
