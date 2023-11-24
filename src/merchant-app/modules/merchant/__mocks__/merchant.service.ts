import { createMerchantStub, merchantFindAllSub, merchantStub } from '../test/stubs/merchant.stub';

export const MerchantService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createMerchantStub()),
  findOne: jest.fn().mockReturnValue(merchantStub()),
  findAll: jest.fn().mockReturnValue(merchantFindAllSub()),
  getMerchantDetailsById: jest.fn().mockReturnValue(merchantStub()),
  getOwnerMerchantAccount: jest.fn().mockReturnValue(merchantStub()),
  getMerchantStatisticsById: jest.fn().mockReturnValue(merchantStub()),
  onlineOffline: jest.fn().mockReturnValue(merchantStub()),
  updateMerchantStatusByOwnerOrMerchantEmployee: jest.fn().mockReturnValue(merchantStub()),
  updateByShoppexEmployee: jest.fn().mockReturnValue(merchantStub()),
  updateSocialMedia: jest.fn().mockReturnValue(merchantStub()),
});
