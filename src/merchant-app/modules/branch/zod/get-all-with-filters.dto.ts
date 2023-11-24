import { z } from 'zod';
import { GetAllDto } from '../../common/zod/get-all.dto';

export const GetAllWithFiltersDto = z
  .object({
    longitude: z.number(),
    latitude: z.number(),
    maxDistance: z.number().optional().nullish().default(25000),
    minDistance: z.number().optional().nullish().default(0),
  })
  .merge(GetAllDto);
