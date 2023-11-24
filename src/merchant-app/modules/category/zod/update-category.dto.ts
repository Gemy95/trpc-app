import { z } from 'zod';

import { CategoryDto } from './category.dto';

export const UpdateCategoryDto = z.object({}).merge(CategoryDto.partial());
