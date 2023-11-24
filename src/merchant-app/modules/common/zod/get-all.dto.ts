import { z } from 'zod';

export enum Order {
  asc = 1,
  desc = -1,
}

export const GetAllDto = z.object({
  page: z.number().int().default(0),
  limit: z.number().int().default(25),
  sortBy: z.string().optional().nullish().default('createdAt'),
  paginate: z.boolean().optional().nullish(),
  order: z.nativeEnum(Order).optional().nullish().default(-1),
});
