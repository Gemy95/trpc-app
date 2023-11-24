import { Address, Client } from '../../../models';
import { omit } from 'lodash';

const client = {
  _id: '62335a7a8adbb71d4f81c3dd',
  name: 'ali',
  countryCode: '+02',
  mobile: '01017431767',
  email: 'ali.gamal95880@gmail.com',
  password: 'Asd12345$',
  countryId: '62335a7a8adbb71d4f81c3dd',
  cityId: '62335a7a8adbb71d4f81c3dd',
  uuid: '',
  balance: 50,
  dateOfBirth: new Date(),
  gender: 'Male',
  status: 'active',
  role: {
    nameArabic: '',
    nameEnglish: '',
    permissions: [
      {
        value: '@tag/all',
        // labelArabic: 'كل صلاحيات العلامات',
        // labelEnglish: `All tag's Permissions`,
      },
    ],
  },
  imageUrl: '',
  mobileIsVerified: true,
  emailIsVerified: true,
  isDeleted: true,
  otp_verify_type: 'mobile',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const address = {
  _id: '6303ea29c8cb8b4876dd226e',
  name: 'XYZ',
  type: 'home',
  street: 'Cairo Streets',
  client: '62917191179638adeed83597',
  location: { type: 'Point', coordinates: [40.67497446887906, 24.731439555105] },
  locationDelta: [40.67497446887906, 24.731439555105],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  active: true,
};

export const clientStub = (): Client => {
  return client;
};

export const createStub = (): Client => {
  return client;
};

export const verifyMobileStub = () => {
  return { ...omit(client, ['password']), token: '###############' };
};

export const verifyEmailStub = (): { client: Client; token: string } => {
  return { client, token: '###############' };
};

export const loginStub = (): { client: Client; token: string } => {
  return { client, token: '###############' };
};

export const requestForgetPasswordStub = (): {
  result: { success: boolean };
  expirationInSeconds: number;
} => {
  return { result: { success: true }, expirationInSeconds: 500 };
};

export const verifyForgetPasswordStub = (): { success: boolean } => {
  return { success: true };
};

export const changePasswordStub = (): { client: Client; token: string } => {
  return { client, token: '###############' };
};

export const updateClientStub = (): Client => {
  return client;
};

export const addressStub = (): Address => {
  return address;
};

export const clientAddAddressStub = (): Address => {
  return address;
};

export const clientListAddressesStub = (): {
  addresses: Address[];
  page: number;
  pages: number;
  length: number;
} => {
  return {
    addresses: [address],
    page: 1,
    pages: 20,
    length: 18,
  };
};

export const clientUpdateAddressStub = (): Address => {
  return address;
};

export const clientRemoveAddressStub = (): Address => {
  return address;
};
