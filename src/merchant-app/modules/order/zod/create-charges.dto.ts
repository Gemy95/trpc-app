import { z } from 'zod';

import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import { Translation } from '../../common/zod/Translation.dto';

export const ChargesTranslationDto = z
  .object({
    name: z.string(),
  })
  .merge(Translation);

export const ChargesDto = z.object({
  amount: z.number(),
  type: z.nativeEnum(AMOUNT_TYPE),
  name: z.string().optional().nullish(),
  translation: z.array(ChargesTranslationDto).optional().nullish(),
});
