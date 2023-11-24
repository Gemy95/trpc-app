import { z } from 'zod';

import { PRODUCT_MEALS_TIME } from '../../common/constants/product';
import { STATUS } from '../../common/constants/status.constants';

export const ProductGroupsOptionsOrders = z.object({
  _id: z.string(),
  serialDisplayNumber: z.number().int().optional().nullish(),
});

export const ProductGroupsOrders = z.object({
  id: z.string(),
  serialDisplayNumber: z.number().int().optional().nullish(),
  options: z.array(ProductGroupsOptionsOrders).optional().nullish(),
});

export const ProductImageDto = z.object({
  url: z.string().url(),
  titleArabic: z.string().optional().nullish(),
  titleEnglish: z.string().optional().nullish(),
  descriptionArabic: z.string().optional().nullish(),
  descriptionEnglish: z.string().optional().nullish(),
  new: z.boolean().optional().nullish(),
});

export const CreateProductDto = z.object({
  nameArabic: z.string(),
  nameEnglish: z.string(),
  descriptionArabic: z.string().optional().nullish(),
  descriptionEnglish: z.string().optional().nullish(),
  preparationTime: z.number(),
  productGroupsIds: z.array(z.string()).optional().nullish(),
  categoriesIds: z.array(z.string()),
  branchesIds: z.array(z.string()),
  images: z.array(ProductImageDto).optional().nullish(),
  mainImage: ProductImageDto.optional().nullish(),
  price: z.number(),
  status: z.nativeEnum(STATUS),
  calories: z.number(),
  mealsTime: z.array(z.nativeEnum(PRODUCT_MEALS_TIME)).optional().nullish(),
  productGroupsOrders: z.array(ProductGroupsOrders).optional().nullish(),
  quantity: z.number().int().optional().nullish().default(100),
});
