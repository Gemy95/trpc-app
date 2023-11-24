import {
  createStub,
  verifyMobileStub,
  verifyEmailStub,
  loginStub,
  requestForgetPasswordStub,
  verifyForgetPasswordStub,
  changePasswordStub,
  updateClientStub,
  clientAddAddressStub,
  clientListAddressesStub,
  clientUpdateAddressStub,
  clientRemoveAddressStub,
} from '../test/stubs/client.stub';

export const ClientService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  verifyMobile: jest.fn().mockReturnValue(verifyMobileStub()),
  verifyEmail: jest.fn().mockReturnValue(verifyEmailStub()),
  login: jest.fn().mockReturnValue(loginStub()),
  requestForgetPassword: jest.fn().mockReturnValue(requestForgetPasswordStub()),
  verifyForgetPassword: jest.fn().mockReturnValue(verifyForgetPasswordStub()),
  changePassword: jest.fn().mockReturnValue(changePasswordStub()),
  update: jest.fn().mockReturnValue(updateClientStub()),
  addAddress: jest.fn().mockReturnValue(clientAddAddressStub()),
  listAddresses: jest.fn().mockReturnValue(clientListAddressesStub()),
  updateAddress: jest.fn().mockReturnValue(clientUpdateAddressStub()),
  removeAddress: jest.fn().mockReturnValue(clientRemoveAddressStub()),
});
