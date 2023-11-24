import { z } from 'zod';

export const BaseQuery = z.object({
  search: z.string().optional().nullish(),
  page: z.number().int().optional().nullish(),
  limit: z.number().int().optional().nullish(),
  paginate: z.boolean().optional().nullish(),
  fields: z.any().optional().nullish(),
  sort: z.any().optional().nullish(),
  populate: z.any().optional().nullish(),
});
