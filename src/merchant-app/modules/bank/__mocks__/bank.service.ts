import { createStub, findAllStub, findOneStub, updateOneStub, removeStub } from '../test/stubs/bank.stub';

export const BankService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getOne: jest.fn().mockReturnValue(findOneStub()),
  getAll: jest.fn().mockReturnValue(findAllStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(removeStub()),
});
