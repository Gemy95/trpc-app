import { createStub, findAllStub, findOneStub, updateStub } from '../test/stubs/rating-scale.stub';

export const RatingScaleService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  update: jest.fn().mockReturnValue(updateStub()),
});
