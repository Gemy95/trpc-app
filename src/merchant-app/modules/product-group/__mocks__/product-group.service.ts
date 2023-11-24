import { createStub, findAllStub, findOneStub, removeStub, updateStub } from '../test/stubs/product-group.stub';

export const ProductGroupService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  update: jest.fn().mockReturnValue(updateStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
});
