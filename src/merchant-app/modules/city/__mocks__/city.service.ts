import {
  createStub,
  allStub,
  checkAvailabilityStub,
  getOneStub,
  updateOneStub,
  deleteOneStub,
  allByCountryIdStub,
} from '../test/stubs/city.stub';

export const CityService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getAll: jest.fn().mockReturnValue(allStub()),
  shoppexAvailability: jest.fn().mockReturnValue(checkAvailabilityStub()),
  getAllByCountryId: jest.fn().mockReturnValue(allByCountryIdStub()),
  getOne: jest.fn().mockReturnValue(getOneStub()),
  updateOne: jest.fn().mockReturnValue(updateOneStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
});
