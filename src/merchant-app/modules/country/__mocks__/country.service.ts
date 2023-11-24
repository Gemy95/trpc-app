import { createStub, deleteOneStub, getAllStub, getOneStub, updateOneStub } from '../test/stubs/country.stub';

export const CountryService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getAll: jest.fn().mockReturnValue(getAllStub()),
  getOne: jest.fn().mockReturnValue(getOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
});
