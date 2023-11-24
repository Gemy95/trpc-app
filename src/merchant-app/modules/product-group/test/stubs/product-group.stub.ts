import mongoose from 'mongoose';
import { ProductGroup } from '../../../models';

const productGroup = {
  _id: '6246cf5880f0eb33208bbce1',
  isDeleted: false,
  merchantId: '62b0f1ff46aea37b91c37094',
  minimum: 1,
  maximum: 10,
  name: 'الحجم',
  translation: [
    {
      _lang: 'en',
      name: 'size',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  options: [
    {
      _id: '6246cf5880f0eb33208bbcef',
      name: 'كبير',
      translation: [{ _id: '6246cf5880f0eb33208bbcf0', _lang: 'en', name: 'Big' }],
      extraPrice: 2,
      serialDisplayNumber: 1,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  required: true,
  serialDisplayNumber: 1,
  __v: 0,
};

export const productGroupStub = (): ProductGroup => {
  return productGroup;
};

export const createStub = (): ProductGroup => {
  return productGroup;
};

export const findAllStub = (): { productgroups: ProductGroup[]; page: number; pages: number; length: number } => {
  return { productgroups: [productGroup], page: 1, pages: 5, length: 15 };
};

export const findOneStub = (): ProductGroup => {
  return productGroup;
};

export const updateStub = (): ProductGroup => {
  return productGroup;
};

export const removeStub = (): ProductGroup => {
  return productGroup;
};
