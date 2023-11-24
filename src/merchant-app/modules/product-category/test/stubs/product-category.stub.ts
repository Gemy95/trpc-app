import { ProductCategory } from '../../../models';

const productCategory = {
  _id: '62bcaab792dce9717f8e9d94',
  name: 'كباب مشوي',
  branches: ['62c8feb1fc3362ff9aee0abd'],
  merchantId: '62b362c3e56c65b1644862c1',
  search: ['category', 'english'],
  translation: [
    {
      _lang: 'en',
      name: 'Gril Meat',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  isDeleted: false,
  status: 'active',
  serialDisplayNumber: 9,
  image: '',
  user: '',
};

export const productCategoryStub = (): ProductCategory => {
  return productCategory;
};

export const createStub = (): ProductCategory => {
  return productCategory;
};

export const getAllStub = (): { page: number; pages: number; length: number } => {
  return { ...productCategory, page: 1, pages: 5, length: 20 };
};

export const getOneStub = () => {
  return productCategory;
};

export const updateOneStub = (): ProductCategory => {
  return productCategory;
};

export const removeStub = (): { message: string } => {
  return { message: 'ProductCategory Deleted Successfully' };
};

export const reOrderSerialNumberStub = (): void => {
  return;
};
