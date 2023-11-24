import { Department } from '../../../models';

const department = {
  _id: '62a63507f823c3be8b4a2e51',
  name: 'الدعم',
  uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
  image: 'https://sproutsocial.com/insights/social-media-image-sizes-guide/',
  translation: [
    {
      _lang: 'en',
      name: 'Support',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  oneSignalTags: ['test'],
  isDeleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const departmentStub = (): Department => {
  return department;
};

export const createStub = (): Department => {
  return department;
};

export const findStub = (): {
  departments: Department[];
  pages: number;
  page: number;
  length: number;
} => {
  return {
    departments: [department],
    pages: 10,
    page: 2,
    length: 15,
  };
};

export const findByIdStub = (): Department => {
  return department;
};

export const updateStub = (): Department => {
  return department;
};

export const removeDepartmentStub = (): { success: boolean } => {
  return { success: true };
};
