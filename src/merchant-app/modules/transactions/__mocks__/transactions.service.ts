import { findAllByMerchantIdStub, findAllStub, findOneStub, updateStub } from '../test/stubs/transactions.stub';

export const TransactionsService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findAllByMerchantId: jest.fn().mockReturnValue(findAllByMerchantIdStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  update: jest.fn().mockReturnValue(updateStub()),
});
