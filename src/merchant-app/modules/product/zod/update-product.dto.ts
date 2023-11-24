import { z } from 'zod';

import { CreateProductDto } from './create-product.dto';

export const UpdateProductDto = z
  .object({
    serialDisplayNumber: z.number().min(1).optional().nullish(),
  })
  .merge(CreateProductDto.partial());
