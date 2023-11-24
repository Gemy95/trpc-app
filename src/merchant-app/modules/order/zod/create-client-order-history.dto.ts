import { z } from 'zod';

export const GetAllClientHistoryDto = z
  .object({
    longitude: z.number().optional().nullish(),
    latitude: z.number().optional().nullish(),
  })
  .optional()
  .nullish();
