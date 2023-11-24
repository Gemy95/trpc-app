import { MerchantEmployee } from '../../../models';

const merchantEmployee = {
  _id: '62e93523386fe3abd31baf3b',
  status: 'active',
  merchantId: '62b362c3e56c65b1644862c1',
  branchesIds: ['62bbae6e982c3a85a3efe50e', '62c8feb1fc3362ff9aee0abd', '62bb6217cc8acb56998878fc'],
  role: {
    nameArabic: 'موظف البائع',
    nameEnglish: 'Merchnt Employee',
    permissions: [
      {
        value: '@branch-category/all',
        // labelArabic: 'كل صلاحيات فئات الفرع',
        // labelEnglish: 'All permission for branch category',
      },
    ],
  },
  name: 'ahmed',
  countryCode: '+966',
  mobile: '55447788',
  email: 'ahmed@ahmed.com',
  password: '$2b$10$mL5gjuwwg50rC27sKZzdseVlTJBwhNE73SBOQFbPR2Ivzzz3AKF22',
  cityId: '617888b6614e652e24444454',
  countryId: '61788866614e6537de444452',
  mobileIsVerified: false,
  emailIsVerified: false,
  isPasswordReset: true,
  type: 'MerchantEmployee',
  dateOfBirth: new Date(),
  uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  gender: 'male',
  job: 'chef',
  image: '',
  merchantName: '',
  __v: 0,
};

export const merchantEmployeeStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const createStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const getMerchantEmployeesByMerchantIdStub = (): {
  merchantEmployees: MerchantEmployee[];
  page: number;
  pages: number;
  length: number;
} => {
  return { merchantEmployees: [merchantEmployee], page: 1, pages: 5, length: 20 };
};

export const findOneStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const updateStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const removeStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const updateMerchantEmployeesByItselfStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const requestChangeEmailStub = (): { result: boolean; counter: number } => {
  return {
    result: true,
    counter: 50,
  };
};

export const verifyChangeEmailStub = (): MerchantEmployee => {
  return merchantEmployee;
};

export const requestChangeMobileStub = (): { result: boolean; counter: number } => {
  return {
    result: true,
    counter: 50,
  };
};

export const verifyChangeMobileStub = (): MerchantEmployee => {
  return merchantEmployee;
};
