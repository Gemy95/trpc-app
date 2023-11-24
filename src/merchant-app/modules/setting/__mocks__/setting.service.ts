import { createStub, deleteOneStub, updateStub } from '../test/stubs/setting.stub';

export const SettingService = jest.fn().mockReturnValue({
  createBranchDistanceSetting: jest.fn().mockReturnValue(createStub()),
  update: jest.fn().mockReturnValue(updateStub()),
  deleteOne: jest.fn().mockReturnValue(deleteOneStub()),
});
