import { createStub, findAllStub, findOneStub, updateOneStub, removeStub } from '../test/stubs/coupon.stub';

export const CouponService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getOne: jest.fn().mockReturnValue(findOneStub()),
  getAll: jest.fn().mockReturnValue(findAllStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(removeStub()),
});
