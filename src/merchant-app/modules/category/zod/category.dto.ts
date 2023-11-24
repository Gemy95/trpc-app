import { z } from 'zod';

import { Translation } from '../../common/zod/Translation.dto';
import { CATEGORY_STATUS_ENUM } from '../category.constants';

export const CategoryTranslationDto = z
  .object({
    name: z.string(),
  })
  .merge(Translation);

export const CategoryDto = z.object({
  name: z.string(),
  status: z.string(), // z.nativeEnum(CATEGORY_STATUS_ENUM),
  client_visibility: z.boolean(),
  stores_visibility: z.boolean(),
  translation: z.array(CategoryTranslationDto),
  image: z.string().url(),
});

export const UpdateCategoryDto = z.object({}).merge(CategoryDto.partial());
