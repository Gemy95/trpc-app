import { Country } from '../../../models';

const country = {
  _id: '62e117f5faa7411f35b93a5f',
  name: 'Egypt',
  client_status: 'active',
  stores_status: 'active',
  translation: [
    {
      _lang: 'en',
      name: 'Egypt',
    },
  ],
  search: ['EG'],
  code: 'EGY',
  __v: 0,
};

export const countryStub = (): Country => {
  return country;
};

export const createStub = (): Country => {
  return country;
};

export const getAllStub = (): {
  countries: [Country];
  page: number;
  pages: number;
  length: number;
} => {
  return {
    countries: [country],
    page: 1,
    pages: 2,
    length: 30,
  };
};

export const getOneStub = (): Country => {
  return country;
};

export const updateOneStub = (): Country => {
  return country;
};

export const deleteOneStub = (): { message: string } => {
  return { message: 'Country Deleted Successfully' };
};
