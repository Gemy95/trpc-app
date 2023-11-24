import { createStub, getAllStub, getOneStub, updateOneStub, deleteOneStub } from '../test/stubs/category.stub';

export const CategoryService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getAll: jest.fn().mockReturnValue(getAllStub()),
  getOne: jest.fn().mockReturnValue(getOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
});
