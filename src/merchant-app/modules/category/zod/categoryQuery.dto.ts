import { z } from 'zod';

import { STATUS } from '../../common/constants/status.constants';
import { BaseQuery } from '../../common/zod/BaseQuery.dto';

export const CategoryQueryDto = z
  .object({
    status: z.nativeEnum(STATUS),
    client_visibility: z.boolean().optional().nullish(),
    stores_visibility: z.boolean().optional().nullish(),
  })
  .merge(BaseQuery);

export const CategoryQueryParamsDto = z.object({}).merge(CategoryQueryDto.partial());
