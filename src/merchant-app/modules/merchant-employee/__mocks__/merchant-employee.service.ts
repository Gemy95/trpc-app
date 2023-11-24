import {
  createStub,
  findOneStub,
  getMerchantEmployeesByMerchantIdStub,
  removeStub,
  requestChangeEmailStub,
  requestChangeMobileStub,
  updateMerchantEmployeesByItselfStub,
  updateStub,
  verifyChangeEmailStub,
  verifyChangeMobileStub,
} from '../test/stubs/merchant-employee.stub';

export const MerchantEmployeeService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  getMerchantEmployeesByMerchantId: jest.fn().mockReturnValue(getMerchantEmployeesByMerchantIdStub()),
  findOne: jest.fn().mockReturnValue(findOneStub()),
  update: jest.fn().mockReturnValue(updateStub()),
  remove: jest.fn().mockReturnValue(removeStub()),
  updateMerchantEmployeeByItself: jest.fn().mockReturnValue(updateMerchantEmployeesByItselfStub()),
  requestChangeEmail: jest.fn().mockReturnValue(requestChangeEmailStub()),
  verifyChangeEmail: jest.fn().mockReturnValue(verifyChangeEmailStub()),
  requestChangeMobile: jest.fn().mockReturnValue(requestChangeMobileStub()),
  verifyChangeMobile: jest.fn().mockReturnValue(verifyChangeMobileStub()),
});
