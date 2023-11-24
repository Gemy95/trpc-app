import { createStub, findAllStub, findOneStub, updateOneStub, removeStub } from '../test/stubs/dashboard-table.stub';

export const DashboardTableService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
});
