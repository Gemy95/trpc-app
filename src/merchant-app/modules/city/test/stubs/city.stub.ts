import { City } from '../../../models';

const city = {
  name: 'test',
  country: '61788866614e6537de444452',
  client_status: 'inActive',
  stores_status: 'inActive',
  location: {
    type: 'Point',
    coordinates: [30.802498, 26.820553],
  },
  locationDelta: [1, 1],
  search: ['test', 'arabic'],
  translation: [
    {
      _lang: 'ar',
      name: 'arabic',
    },
  ],
  longitude: 30.802498,
  latitude: 26.820553,
  longitudeDelta: 1,
  latitudeDelta: 1,
  _id: '6320f005a13651540d5c16c8',
  createdAt: '2022-09-13T21:03:01.623Z',
  updatedAt: '2022-09-13T21:03:01.623Z',
  isEnabledReservation: true,
  __v: 0,
};

export const cityStub = (): City => {
  return city;
};

export const createStub = (): City => {
  return city;
};

export const allStub = (): { cities: City[]; page: number; pages: number; length: number } => {
  return {
    cities: [city],
    page: 1,
    pages: 10,
    length: 15,
  };
};

export const checkAvailabilityStub = (): { available: boolean } => {
  return { available: true };
};

export const allByCountryIdStub = (): {
  cities: City[];
  page: number;
  pages: number;
  length: number;
} => {
  return {
    cities: [city],
    page: 1,
    pages: 10,
    length: 15,
  };
};

export const getOneStub = (): City => {
  return city;
};

export const updateOneStub = (): City => {
  return city;
};

export const deleteOneStub = (): { message: string } => {
  return { message: 'City Deleted Successfully' };
};
