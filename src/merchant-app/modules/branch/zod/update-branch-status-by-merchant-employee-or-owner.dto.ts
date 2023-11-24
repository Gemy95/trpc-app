import { z } from 'zod';

import { VISIBILITY_STATUS } from '../../common/constants/branch.constants';

export const UpdateBranchStatusByMerchantEmployeeOrOwnerDto = z.object({
  visibility_status: z.nativeEnum(VISIBILITY_STATUS),
});
