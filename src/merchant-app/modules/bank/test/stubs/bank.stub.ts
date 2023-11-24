import { Bank } from '../../../models';

const bank = {
  _id: '63c1a3bd452fb1cfaf1e4791',
  name: 'cib egy',
  logo: 'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/main/143f72e2-2901-4f06-8647-08561ab33c97-base-logo.png',
  translation: [
    {
      _lang: 'ar',
      name: 'cib',
    },
  ],
  country: '6345ef704ac67c1057db1766',
  isDeleted: false,
  createdAt: '',
  updatedAt: '',
  __v: 0,
};

export const bankStub = (): Bank => {
  return bank;
};

export const createStub = (): Bank => {
  return bank;
};

export const findAllStub = (): { page: 1; pages: number; length: number; branchgroups: [Bank] } => {
  return {
    page: 1,
    pages: 2,
    length: 10,
    branchgroups: [bank],
  };
};

export const findOneStub = (): Bank => {
  return bank;
};

export const updateOneStub = (): Bank => {
  return bank;
};

export const removeStub = (): Bank => {
  return bank;
};
