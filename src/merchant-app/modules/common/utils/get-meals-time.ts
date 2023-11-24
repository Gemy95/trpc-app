import { PRODUCT_MEALS_TIME } from '../constants/product';

export function getMealsTime(name: PRODUCT_MEALS_TIME) {
  switch (name) {
    case PRODUCT_MEALS_TIME.PRODUCT_BREAKFAST:
      return { from: '6:00', to: '11:59' };
    case PRODUCT_MEALS_TIME.PRODUCT_LAUNCH:
      return { from: '12', to: '18:59' };
    case PRODUCT_MEALS_TIME.PRODUCT_DINNER:
      return { from: '19:00', to: '24:00' };
    default:
      return { from: '', to: '' };
  }
}
