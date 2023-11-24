import { createManyStub, getStub, updateManyStub, deleteStub } from '../test/stub/onboarding.stub';

export const OnBoardingService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createManyStub()),
  get: jest.fn().mockReturnValue(getStub()),
  update: jest.fn().mockReturnValue(updateManyStub()),
  remove: jest.fn().mockReturnValue(deleteStub()),
});
