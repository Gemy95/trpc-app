import { createStub, findAllStub, findOneStub, updateOneStub, removeStub } from '../test/stubs/product.stub';

export const ProductService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
});
