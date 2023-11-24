import mongoose from 'mongoose';
import { Product } from '../../../models';

const product = {
  _id: '6246d21d5300b638c34c7c08',
  isDeleted: false,
  visibleToClients: true,
  categoriesIds: ['6246cf5880f0eb33208bbcee', '62be1713f393fe15b8fc7dd9'].map((id) => new mongoose.Types.ObjectId(id)),
  productGroupsIds: ['6246cf5880f0eb33208bbcee'].map((id) => new mongoose.Types.ObjectId(id)),
  preparationTime: 20,
  price: 100,
  images: [
    {
      _id: '6246d3bb957e4a3bddb5c2df',
      url: 'https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg',
      descriptionArabic: 'aaaa',
      descriptionEnglish: 'aaaa',
      titleArabic: 'aaa',
      titleEnglish: 'aaa',
      new: false,
      description: 'aaa',
    },
  ],
  mainImage: {
    url: 'https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg',
    title: 'aaa',
    description: 'aaa',
    descriptionArabic: 'aaaa',
    descriptionEnglish: 'aaaa',
    titleArabic: 'aaa',
    titleEnglish: 'aaa',
    new: true,
  },
  name: 'Arabic name 001',
  description: 'test description',
  translation: [{ _lang: 'en', name: 'English name 001', description: 'test' }],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  branchesIds: ['6236079b71526548e301f9ce'].map((id) => new mongoose.Types.ObjectId(id)),
  numberOfSale: 10,
  inReview: false,
  merchantId: new mongoose.Types.ObjectId('6234a6a942fb5ca7b63534bb'),
  approvedBy: new mongoose.Types.ObjectId('62b4a96e282a3c1b08668538'),
  build_status: 'approved',
  release_status: 'production',
  status: 'active',
  calories: 1,
  serialDisplayNumber: 12345,
  discount: '62b4a96e282a3c1b08668538',
  nameArabic: 'string',
  nameEnglish: 'string',
  descriptionArabic: 'string',
  descriptionEnglish: 'string',
  mealsTime: [{ name: 'dinner', times: { from: '19:00', to: '24:00' } }],
  productGroupsOrders: [
    {
      id: '6234a6a942fb5ca7b63534bb',
      serialDisplayNumber: 1,
      options: [
        {
          _id: '6234a6a942fb5ca7b63534bb',
          serialDisplayNumber: 1,
        },
      ],
    },
  ],
  remainingQuantity: 100,
  quantity: 100,
  tagsIds: [],
};

export const productStub = (): Product => {
  return product;
};

export const createStub = (): Product => {
  return product;
};

export const findOneStub = (): Product => {
  return product;
};

export const findAllStub = (): Product[] => {
  return [product];
};

export const removeStub = (): Product => {
  return product;
};

export const updateOneStub = (): Product => {
  return product;
};
