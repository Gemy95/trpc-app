import { Coupon } from '../../../models';

const coupon = {
  _id: '648a0dd4e1966f98b4c3da94',
  code: 'XYZ',
  description: 'asd',
  image: '',
  valid_from: new Date(),
  expired_at: new Date(),
  status: 'active',
  total_max_use: 15,
  max_use_per_client: 2,
  discount_amount: 50,
  discount_type: 'fixed',
  free_delivery: false,
  is_new_client: true,
  client_orders_count_more_than: 1,
  orderType: 'book',
  merchantId: '63543aca7819a6c9a8b9c068',
  branchId: '63543aca7819a6c9a8b9c068',
  productsIds: ['63543aca7819a6c9a8b9c068'],
  max_discount_amount: 100,
  lowest_cart_price: 200,
  is_reusable: true,
  createdAt: '2023-06-14T18:58:28.887+00:00',
  updatedAt: '2023-06-14T18:58:28.887+00:00',
  __v: 0,
};

export const couponStub = (): Coupon => {
  return coupon;
};

export const createStub = (): Coupon => {
  return coupon;
};

export const findAllStub = (): { page: 1; pages: number; length: number; coupons: [Coupon] } => {
  return {
    page: 1,
    pages: 2,
    length: 10,
    coupons: [coupon],
  };
};

export const findOneStub = (): Coupon => {
  return coupon;
};

export const updateOneStub = (): Coupon => {
  return coupon;
};

export const removeStub = (): Coupon => {
  return coupon;
};
