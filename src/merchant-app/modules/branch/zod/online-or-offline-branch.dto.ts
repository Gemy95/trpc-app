import { z } from 'zod';

import { VISIBILITY_STATUS } from '../../common/constants/branch.constants';

export const OnlineOfflineBranchDto = z.object({
  visibility_status: z.nativeEnum(VISIBILITY_STATUS),
  notes: z.array(z.string()).optional().nullish(),
});
