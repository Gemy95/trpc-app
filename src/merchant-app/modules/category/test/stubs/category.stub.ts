import { Category } from '../../../models';

const category = {
  _id: '617888dc614e65acaf444455',
  search: ['restaurants', 'المطاعم'],
  name: 'Restaurants',
  status: 'active',
  translation: [
    {
      _lang: 'ar',
      name: 'المطاعم',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  client_visibility: true,
  stores_visibility: false,
  image:
    'https://shopex-uploads.s3.amazonaws.com/dev/055d2a2c-595d-4aff-aa3d-d5c33347a8d5-Register-Cleaning-Company-in-Singapore-e1594800034260.jpg',
};

export const categoryStub = (): Category => {
  return category;
};

export const createStub = (): Category => {
  return category;
};

export const getAllStub = (): {
  categories: Category[];
  page: number;
  pages: number;
  length: number;
} => {
  return {
    categories: [category],
    page: 1,
    pages: 15,
    length: 50,
  };
};

export const getOneStub = (): Category => {
  return category;
};

export const updateOneStub = (): Category => {
  return category;
};

export const deleteOneStub = (): { message: string } => {
  return { message: 'Category Deleted Successfully' };
};
