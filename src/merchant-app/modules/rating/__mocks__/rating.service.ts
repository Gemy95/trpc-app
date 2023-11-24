import { getLatestOrderStub, booleanStub, ratingsStubValue, dashboardRatingStub } from '../test/stubs/rating.stub';

export const RatingService = jest.fn().mockReturnValue({
  rateOrder: jest.fn().mockReturnValue(booleanStub()),
  rateMerchant: jest.fn().mockReturnValue(booleanStub()),
  getLatestOrder: jest.fn().mockReturnValue(getLatestOrderStub()),
  getMerchantOrdersRating: jest.fn().mockReturnValue(ratingsStubValue()),
  getBranchOrdersRating: jest.fn().mockReturnValue(ratingsStubValue()),
  getMerchantRating: jest.fn().mockReturnValue(ratingsStubValue()),
  hideComment: jest.fn().mockReturnValue(booleanStub()),
  dashboardRating: jest.fn().mockReturnValue(dashboardRatingStub()),
});
