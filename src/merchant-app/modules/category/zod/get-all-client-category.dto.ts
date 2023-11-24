import { z } from 'zod';

import { GetAllDto } from '../../common/zod/get-all.dto';

export const GetAllClientCategoryDto = z.object({}).merge(GetAllDto).optional().nullish().default({});
