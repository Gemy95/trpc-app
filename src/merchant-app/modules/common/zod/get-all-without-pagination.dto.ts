import { z } from 'zod';

export enum Order {
  asc = 1,
  desc = -1,
}

export const GetAllDto = z.object({
  page: z.number().int().optional().nullish(),
  limit: z.number().int().optional().nullish(),
  sortBy: z.string().optional().nullish().default('createdAt'),
  paginate: z.boolean().optional().nullish(),
  order: z.nativeEnum(Order).optional().nullish().default(-1),
});
