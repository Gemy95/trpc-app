import { z } from 'zod';

export const GetAllNearestDto = z.object({
  categoriesIds: z.array(z.string()).optional().nullish(),
  longitude: z.number().optional().nullish(),
  latitude: z.number().optional().nullish(),
  clientId: z.string(),
});

export const GetAllNearestFilterObject = z.object({
  sortByPrice: z.string().optional().nullish(),
  productCategoriesNames: z.array(z.string()).optional().nullish(),
  maxDistance: z.number().optional().nullish(),
  minDistance: z.number().optional().nullish(),
  price: z.string().optional().nullish().default('$'),
  rate: z.number().min(3).max(5).optional().nullish(),
});
