import { z } from 'zod';

import { VISIBILITY_STATUS } from '../../common/constants/branch.constants';

export const ChangeStatusDto = z.object({
  status: z.nativeEnum(VISIBILITY_STATUS),
  notes: z.array(z.string()).optional(),
});
