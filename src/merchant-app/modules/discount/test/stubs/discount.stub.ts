import { Discount } from '../../../models';

const discount = {
  _id: '631bac6145375e179beddd46',
  amount: 36,
  type: 'percentage',
  startDate: new Date(),
  endDate: new Date(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

const discountFindOne = {
  __v: 0,
  _id: '6246d21d5300b638c34c7c08',
  approvedBy: '62b4a96e282a3c1b08668538',
  branchesIds: ['6236079b71526548e301f9ce'],
  build_status: 'approved',
  calories: 1,
  categoriesIds: ['6246cf5880f0eb33208bbcee', '62be1713f393fe15b8fc7dd9'],
  description: 'test description',
  descriptionArabic: 'string',
  descriptionEnglish: 'string',
  discount: '62b4a96e282a3c1b08668538',
  images: [
    {
      _id: '6246d3bb957e4a3bddb5c2df',
      description: 'aaa',
      descriptionArabic: 'aaaa',
      descriptionEnglish: 'aaaa',
      new: false,
      titleArabic: 'aaa',
      titleEnglish: 'aaa',
      url: 'https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg',
    },
  ],
  inReview: false,
  isDeleted: false,
  mainImage: {
    description: 'aaa',
    descriptionArabic: 'aaaa',
    descriptionEnglish: 'aaaa',
    new: true,
    title: 'aaa',
    titleArabic: 'aaa',
    titleEnglish: 'aaa',
    url: 'https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg',
  },
  merchantId: '6234a6a942fb5ca7b63534bb',
  name: 'Arabic name 001',
  nameArabic: 'string',
  nameEnglish: 'string',
  numberOfSale: 10,
  preparationTime: 20,
  price: 100,
  productGroupsIds: ['6246cf5880f0eb33208bbcee'],
  release_status: 'production',
  serialDisplayNumber: 12345,
  status: 'active',
  translation: [{ _lang: 'en', description: 'test', name: 'English name 001' }],
  visibleToClients: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const discountStub = (): Discount => {
  return discount;
};

export const createStub = (): Discount => {
  return discount;
};

export const findAllStub = (): Discount[] => {
  return [discount];
};

export const findAllByMerchantIdStub = (): Discount => {
  return discount;
};

export const findOneStub = () => {
  return discountFindOne;
};

export const updateStub = (): Discount => {
  return discount;
};

export const removeStub = (): Discount => {
  return discount;
};
