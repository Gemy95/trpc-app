import { z } from 'zod';

import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { ORDER_TYPE } from '../../common/constants/order.constants';

export const Options = z.object({
  _id: z.string(),
  name: z.string().optional().nullish(),
  extraPrice: z.number().optional().nullish(),
});

export const Groups = z.object({
  productGroupId: z.string(),
  options: z.array(Options).optional().nullish(),
});

export const Item = z.object({
  count: z.number(),
  productId: z.string(),
  // groups: z.array(Groups).optional().nullish()
});

export const CreateOrderDto = z.object({
  branchId: z.string(),
  clientNotes: z.array(z.string()).optional().nullish(),
  paymentType: z.nativeEnum(PAYMENT_TYPES).optional().nullish(),
  orderType: z.nativeEnum(ORDER_TYPE).optional().nullish(),
  items: z.array(Item),
  tableId: z.string().optional().nullish(),
  couponCode: z.string().optional().nullish(),
});
