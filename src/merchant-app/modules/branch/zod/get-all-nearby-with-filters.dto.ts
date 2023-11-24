import { z } from 'zod';
import { GetAllDto } from '../../common/zod/get-all.dto';

export const GetAllNearByFilterObject = z.object({
  sortByPrice: z.string().optional().nullish(),
  productCategoriesNames: z.array(z.string()).optional().nullish(),
  maxDistance: z.number().optional().nullish().default(25000),
  minDistance: z.number().optional().nullish().default(0),
  fastest: z.boolean().optional().nullish(),
  trending: z.boolean().optional().nullish(),
  nearest: z.boolean().optional().nullish(),
  rate: z.number().min(3).max(5).optional().nullish(),
});

export const GetAllNearByDto = z
  .object({
    filters: GetAllNearByFilterObject,
    categoriesIds: z.array(z.string()).optional().nullish(),
    tagsIds: z.array(z.string()).optional().nullish(),
    longitude: z.number().optional().nullish(),
    latitude: z.number().optional().nullish(),
    price: z.number().optional().nullish(),
    clientId: z.string(),
  })
  .merge(GetAllDto);
