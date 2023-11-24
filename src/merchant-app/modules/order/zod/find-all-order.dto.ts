import { z } from 'zod';

import { ORDER_STATUS } from '../../common/constants/order.constants';
import { GetAllDto } from '../../common/zod/get-all-without-pagination.dto';

export const findAllOrderQueryDto = z
  .object({
    status: z.array(z.nativeEnum(ORDER_STATUS)).optional().nullish(),
  })
  .merge(GetAllDto)
  .optional()
  .nullish();
