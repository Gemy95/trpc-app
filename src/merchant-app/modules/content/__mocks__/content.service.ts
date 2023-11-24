import { createStub, deleteOneStub, updateOneStub } from '../test/stubs/content.stub';

export const ContentService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  update: jest.fn().mockReturnValue(updateOneStub()),
  remove: jest.fn().mockReturnValue(deleteOneStub()),
});
