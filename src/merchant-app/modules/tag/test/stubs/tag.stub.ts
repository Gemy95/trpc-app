import { Tag } from '../../../models';

const tag = {
  _id: '6345f78681b716e41dfb3ce2',
  name: 'رغيف الخبز',
  search: ['رغيف', 'الخبز', 'bread'],
  category: '6345ef96eeab41b10728d586',
  status: 'active',
  translation: [
    {
      _lang: 'en',
      name: 'Bread',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  client_visibility: true,
  stores_visibility: true,
  new: true,
  image:
    'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/056aeee8-a3a7-46fb-91c5-96c3df62e718-leti-kugler-I-ykyShydj0-unsplash.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const tagStub = (): Tag => {
  return tag;
};

export const createStub = (): Tag => {
  return tag;
};

export const getAllByCategoryIdStub = (): { tags: [Tag]; page: number; pages: number; length: number } => {
  return {
    tags: [tag],
    page: 1,
    pages: 5,
    length: 10,
  };
};

export const getOneStub = (): Tag => {
  return tag;
};

export const updateOneStub = (): Tag => {
  return tag;
};

export const deleteOneStub = (): { message: string } => {
  return { message: 'Tag Deleted Successfully' };
};

export const findStub = (): { tags: [Tag]; page: number; pages: number; length: number } => {
  return {
    tags: [tag],
    page: 1,
    pages: 5,
    length: 10,
  };
};
