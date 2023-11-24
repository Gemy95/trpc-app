import {
  createStub,
  deleteOneStub,
  findStub,
  getAllByCategoryIdStub,
  getOneStub,
  updateOneStub,
} from '../test/stubs/tag.stub';

export const TagService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getAllByCategoryId: jest.fn().mockReturnValue(getAllByCategoryIdStub()),
  getOne: jest.fn().mockReturnValue(getOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
  find: jest.fn().mockReturnValue(findStub()),
});
