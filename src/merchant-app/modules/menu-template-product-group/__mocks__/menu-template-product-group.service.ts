import {
  createStub,
  findAllStub,
  findOneStub,
  updateOneStub,
  removeStub,
} from '../test/stubs/menu-template-product-group.stub';

export const MenuTemplateProductGroupService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  getAll: jest.fn().mockReturnValue(findAllStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(removeStub()),
});
