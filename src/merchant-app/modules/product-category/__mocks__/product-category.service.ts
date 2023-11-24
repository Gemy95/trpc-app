import {
  createStub,
  getAllStub,
  getOneStub,
  removeStub,
  reOrderSerialNumberStub,
  updateOneStub,
} from '../test/stubs/product-category.stub';

export const ProductCategoryService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getAll: jest.fn().mockReturnValue(getAllStub()),
  getOne: jest.fn().mockReturnValue(getOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
  reOrderSerialNumber: jest.fn().mockReturnValue(reOrderSerialNumberStub()),
});
