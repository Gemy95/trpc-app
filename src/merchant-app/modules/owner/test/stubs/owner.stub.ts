import { MerchantEmployee, Owner } from '../../../models';

const owner = {
  _id: '62e4355e60d7424bfe733133',
  status: 'active',
  role: {
    nameArabic: 'مالك',
    nameEnglish: 'Owner',
    permissions: [
      {
        value: '@branch-category/all',
        // labelArabic: 'كل صلاحيات فئات الفرع',
        // labelEnglish: 'All permission for branch category',
      },
    ],
  },
  name: 'محمد محمد احمد',
  countryCode: '+2',
  mobile: '01060701797',
  email: 'viboh89066@chimpad.com',
  password: '$2b$10$0k9ZBu0aopTej20GWxOhXeH53s2c38zmThH76vWCAkMk6CqL9Wvv2',
  cityId: '629b069f1cb47f37b77f68a4',
  countryId: '625fc14e08c5fb32bb384731',
  uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
  mobileIsVerified: false,
  emailIsVerified: false,
  dateOfBirth: new Date(),
  gender: 'male',
  type: 'Owner',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  __v: 0,
};

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
  type: 'MerchantEmployee',
  dateOfBirth: new Date(),
  uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  gender: 'male',
  __v: 0,
};

export const ownerStub = (): Owner => {
  return owner;
};

export const createOwnerStub = (): { message; newOwner: Owner } => {
  return {
    message: 'Successfully created',
    newOwner: owner,
  };
};

export const ownerFindAllSub = () => {
  return {
    owners: [owner],
    page: 0,
    pages: 1,
    length: 21,
    rejected: 0,
    approved: 0,
    pending: 0,
  };
};

export const verifyMobileStub = (): {
  owner_or_merchant_employee: Owner | MerchantEmployee;
  token: string;
  success: boolean;
} => {
  return {
    owner_or_merchant_employee: owner || merchantEmployee,
    token: 'jwt token',
    success: true,
  };
};

export const verifyEmailStub = (): {
  owner_or_merchant_employee: Owner | MerchantEmployee;
  token: string;
  success: boolean;
} => {
  return {
    owner_or_merchant_employee: owner || merchantEmployee,
    token: 'jwt token',
    success: true,
  };
};

export const loginStub = (): {
  owner_or_merchant_employee: Owner | MerchantEmployee;
  token: string;
} => {
  return {
    owner_or_merchant_employee: owner || merchantEmployee,
    token: 'jwt token',
  };
};

export const requestForgetPasswordStub = (): boolean => {
  return true;
};

export const requestChangeMobileStub = (): { result: boolean; counter: number } => {
  return {
    result: true,
    counter: 50,
  };
};

export const verifyForgetPasswordStub = (): { success: boolean } => {
  return {
    success: true,
  };
};

export const changePasswordStub = (): {
  owner_or_merchant_employee: Owner | MerchantEmployee;
  token: string;
} => {
  return {
    owner_or_merchant_employee: owner || merchantEmployee,
    token: 'jwt token',
  };
};

export const getOwnerDetailsByIdStub = (): { owner: Owner } => {
  return {
    owner: owner,
  };
};

export const adminUpdateOwnerStub = (): { owner: Owner } => {
  return {
    owner: owner,
  };
};

export const getByMobileOrEmailStub = (): { owner: Owner } => {
  return {
    owner: owner,
  };
};

export const getOwnerByIdStub = (): { owner: Owner } => {
  return {
    owner: owner,
  };
};

export const updateOwnerByItselfStub = (): { updatedOwner: Owner } => {
  return {
    updatedOwner: owner,
  };
};

export const requestChangeEmailStub = (): { result: boolean; counter: number } => {
  return {
    result: true,
    counter: 50,
  };
};

export const verifyChangeEmailStub = (): { updatedOwner: Owner } => {
  return {
    updatedOwner: owner,
  };
};

export const requestChangeMobile = (): { result: boolean; counter: number } => {
  return {
    result: true,
    counter: 50,
  };
};

export const verifyChangeMobileStub = (): { updatedOwner: Owner } => {
  return {
    updatedOwner: owner,
  };
};

export const findOwnerOrMerchantEmployeeByIdStub = (): Owner | MerchantEmployee => {
  return owner || merchantEmployee;
};
