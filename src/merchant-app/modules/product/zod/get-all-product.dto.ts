import { z } from 'zod';

import { BUILD_STATUS, RELEASE_STATUS } from '../../common/constants/product';
import { STATUS } from '../../common/constants/status.constants';
import { GetAllDto } from '../../common/zod/get-all.dto';

export const GetAllProductDto = z
  .object({
    search: z.string().optional().nullish(),
    categories: z.array(z.string()).optional().nullish(),
    branches: z.array(z.string()).optional().nullish(),
    build_status: z.nativeEnum(BUILD_STATUS).optional().nullish(),
    status: z.nativeEnum(STATUS).optional().nullish(),
    release_status: z.nativeEnum(RELEASE_STATUS).optional().nullish(),
  })
  .merge(GetAllDto);
