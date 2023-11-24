import { Table } from '../../../models';

const table = {
  _id: '641b73044dacb7cbbba23d1f',
  number: '2',
  floor: 3,
  capacity: 7,
  vip: true,
  extraPrice: 0,
  name: 'الامل',
  description: '',
  type: 'table',
  status: 'available',
  branchId: '63ebd34139658911217be7a1',
  location: ['east', 'south'],
  translation: [
    {
      _lang: 'en',
      name: 'test',
      location: ['east', 'south'],
      description: 'test',
    },
  ],
  images: [
    {
      url: 'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/main/cf4c7932-d46e-4636-b0c5-218296e56f5e-download.jpeg',
      translation: [
        {
          _lang: 'en',
          title: 'ttt',
          description: 'aaa',
        },
      ],
    },
  ],
  isDeleted: false,
  createdAt: '2023-03-22T21:28:36.630Z',
  updatedAt: '2023-03-24T17:31:03.829Z',
  workingHours: [
    {
      day: '',
      durations: [
        {
          startAt: '',
          endAt: '',
        },
      ],
    },
  ],
  __v: 0,
};

export const tableStub = (): Table => {
  return table;
};

export const createStub = (): Table => {
  return table;
};

export const findAllStub = (): { page: 1; pages: number; length: number; tables: [Table] } => {
  return {
    page: 1,
    pages: 2,
    length: 10,
    tables: [table],
  };
};

export const findOneStub = (): Table => {
  return table;
};

export const updateOneStub = (): Table => {
  return table;
};

export const removeStub = (): Table => {
  return table;
};
