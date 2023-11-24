import {
  createStub,
  findAllStub,
  findAllByMerchantIdStub,
  findOneStub,
  updateStub,
  removeStub,
} from '../test/stubs/discount.stub';

export const DiscountService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findAllByMerchantId: jest.fn().mockReturnValue(findAllByMerchantIdStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  update: jest.fn().mockReturnValue(updateStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
});
