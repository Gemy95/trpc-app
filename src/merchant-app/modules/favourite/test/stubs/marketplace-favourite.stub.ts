import mongoose from 'mongoose';
import { Client, Favorite } from '../../../models';

const favorite = {
  _id: '6356bd9f43641211368b60ea',
  clientId: new mongoose.Types.ObjectId('634b264007aa468269265b3c'),
  merchantId: new mongoose.Types.ObjectId('6345f955f5c384002219a0ea'),
  branchId: new mongoose.Types.ObjectId('6346ea728231ea4240db0021'),
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

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
  nameArabic: 'العميل',
  nameEnglish: 'Client',
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
  otp_verify_type: 'mobile',
  isDeleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const clientStub = (): Client => {
  return client;
};

export const favoriteStub = (): Favorite => {
  return favorite;
};

export const createStub = (): { success: boolean } => {
  return { success: true };
};

export const findAllStub = (): { favorites: Favorite[]; pages: number; page: number; length: number } => {
  return {
    favorites: [favorite],
    page: 1,
    pages: 5,
    length: 15,
  };
};

export const deleteOneStub = (): { success: boolean } => {
  return { success: true };
};
