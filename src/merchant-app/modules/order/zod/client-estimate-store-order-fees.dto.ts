import { z } from 'zod';

import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { ORDER_TYPE } from '../../common/constants/order.constants';

export const EstimateStoreOrderFeesDto = z.object({
  branchId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  merchantId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  orderType: z.nativeEnum(ORDER_TYPE),
  paymentType: z.nativeEnum(PAYMENT_TYPES),
  longitude: z.number().optional().nullish(),
  latitude: z.number().optional().nullish(),
  coupons: z.array(z.string()).optional().nullish(),
});
