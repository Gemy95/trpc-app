import { Content, ContentType } from '../../../models';

const content: Content & { _id: string; createdAt: Date; updatedAt: Date; __v: number } = {
  _id: '631123b8b0a0381b5ff0f3c4',
  text: 'text',
  translation: [{ _lang: 'ar', text: 'Ar Text' }],
  faq: [],
  content_type: ContentType.MERCHANT_PRIVACY,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const contentStub = (): Content => {
  return content;
};

export const createStub = (): Content => {
  return content;
};

export const updateOneStub = (): Content => {
  return content;
};

export const deleteOneStub = (): Content => {
  return content;
};
