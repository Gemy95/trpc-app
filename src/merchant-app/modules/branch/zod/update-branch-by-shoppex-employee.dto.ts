import { z } from 'zod';

import { BRANCH_STATUS, BRANCH_STATUS_TAGS, VISIBILITY_STATUS } from '../../common/constants/branch.constants';
import { CreateBranchDto } from './create-branch.dto';

export const UpdateBranchByShoppexEmployeeDto = z
  .object({
    status: z.nativeEnum(BRANCH_STATUS),
    status_tags: z.nativeEnum(BRANCH_STATUS_TAGS).optional().nullable(),
    visibility_status: z.nativeEnum(VISIBILITY_STATUS).optional().nullable(),
  })
  .merge(CreateBranchDto.partial());
