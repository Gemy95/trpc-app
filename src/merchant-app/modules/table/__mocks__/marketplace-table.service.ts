import { findAllStub, findOneStub } from '../test/stubs/dashboard-table.stub';

export const MarketplaceTableService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockReturnValue(findOneStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
});
