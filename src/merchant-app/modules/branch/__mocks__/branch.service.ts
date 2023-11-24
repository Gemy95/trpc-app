import {
  createStub,
  findAllStub,
  findOneStub,
  removeStub,
  reApplyStub,
  freezingStub,
  onlineOrOfflineStub,
  updateBranchStatusByOwnerOrMerchantEmployeeStub,
  getBranchDetailsStub,
  updateByShoppexEmployeeStub,
} from '../test/stubs/branch.stub';

export const BranchService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  findAll: jest.fn().mockReturnValue(findAllStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
  reApply: jest.fn().mockReturnValue(reApplyStub()),
  freezing: jest.fn().mockReturnValue(freezingStub()),
  onlineOrOffline: jest.fn().mockReturnValue(onlineOrOfflineStub()),
  updateBranchStatusByOwnerOrMerchantEmployee: jest
    .fn()
    .mockReturnValue(updateBranchStatusByOwnerOrMerchantEmployeeStub()),
  getBranchDetails: jest.fn().mockReturnValue(getBranchDetailsStub()),
  updateByShoppexEmployee: jest.fn().mockReturnValue(updateByShoppexEmployeeStub()),
});
