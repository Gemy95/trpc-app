import { z } from 'zod';

import { GetAllDto } from '../../common/zod/get-all.dto';

export const GetAllClientTagDto = z
  .object({
    categoriesIds: z.array(z.object({ categoryId: z.string() })),
  })
  .merge(GetAllDto);
