import { createStub, findAllStub, deleteOneStub } from '../test/stubs/marketplace-favourite.stub';

export const MarketplaceFavoriteService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
});
