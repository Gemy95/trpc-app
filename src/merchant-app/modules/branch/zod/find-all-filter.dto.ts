import { z } from 'zod';

import { BRANCH_STATUS, BRANCH_STATUS_TAGS, VISIBILITY_STATUS } from '../../common/constants/branch.constants';
import { BaseQuery } from '../../common/zod/BaseQuery.dto';

export const FindAllBranchDto = z
  .object({
    cities: z.array(z.string()).optional().nullish(),
    status: z.nativeEnum(BRANCH_STATUS).optional().nullish(),
    status_tags: z.nativeEnum(BRANCH_STATUS_TAGS).optional().nullish(),
    visibility_status: z.nativeEnum(VISIBILITY_STATUS).optional().nullish(),
  })
  .merge(BaseQuery.partial());
