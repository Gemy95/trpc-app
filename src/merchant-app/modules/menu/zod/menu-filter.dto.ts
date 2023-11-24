import { z } from 'zod';

import { MERCHANT_STATUS } from '../../common/constants/merchant';
import { PRODUCT_CATEGORY_STATUS } from '../../product-category/dto/product-category.enum';

export const MenuFilterDto = z.object({
  search: z.string().optional().nullish(),
  productcategoriesIds: z.array(z.string()).optional().nullish(),
  productCategoryStatus: z.nativeEnum(PRODUCT_CATEGORY_STATUS).optional().nullish(),
  productStatus: z.nativeEnum(PRODUCT_CATEGORY_STATUS).optional().nullish(),
  branchesIds: z.array(z.string()).optional().nullish(),
  status: z.nativeEnum(MERCHANT_STATUS).optional().nullish(),
});
