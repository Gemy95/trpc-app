import { createStub, findByIdStub, updateStub, removeDepartmentStub, findStub } from '../test/stubs/departments.stub';

export const DepartmentsService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(createStub()),
  find: jest.fn().mockReturnValue(findStub()),
  findById: jest.fn().mockReturnValue(findByIdStub()),
  update: jest.fn().mockReturnValue(updateStub()),
  removeDepartment: jest.fn().mockReturnValue(removeDepartmentStub()),
});
