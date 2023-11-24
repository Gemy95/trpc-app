import { z } from 'zod';

import { Translation } from '../../common/zod/Translation.dto';

export const TagTranslationDto = z.object({ name: z.string() }).merge(Translation);
export const TagDto = z.object({
  name: z.string(),
  new: z.boolean().optional().nullish(),
  client_visibility: z.boolean(),
  stores_visibility: z.boolean(),
  image: z.string().url(),
  translation: z.array(TagTranslationDto),
});
