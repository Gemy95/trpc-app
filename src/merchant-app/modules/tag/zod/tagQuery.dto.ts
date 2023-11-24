import { z } from 'zod';

import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/zod/BaseQuery.dto';

export const TagQueryDto = z
  .object({
    status: z.nativeEnum(STATUS).optional().nullish(),
    categories: z.array(z.string()).optional().nullish(),
    client_visibility: z.boolean().optional().nullish(),
    stores_visibility: z.boolean().optional().nullish(),
  })
  .merge(BaseQuery);
