import { z } from 'zod';

import { GetAllDto } from '../../common/zod/get-all.dto';

export const MarketplaceGetAllProductDto = z
  .object({
    merchantId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .nullish(),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .nullish(),
  })
  .merge(GetAllDto.partial())
  .optional()
  .nullish();
