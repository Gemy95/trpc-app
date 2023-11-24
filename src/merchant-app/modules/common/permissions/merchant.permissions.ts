import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@merchant/all',
  name: 'كل صلاحيات المتجر',
  translation: [
    {
      _lang: 'en',
      name: `All Merchant's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@merchant/create',
  name: 'انشاء متجر',
  translation: [
    {
      _lang: 'en',
      name: 'Create Merchant',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@merchant/update',
  name: 'تعديل المتجر',
  translation: [
    {
      _lang: 'en',
      name: 'Update Merchant',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@merchant/read',
  name: 'قراة المتجر',
  translation: [
    {
      _lang: 'en',
      name: 'Read Merchant',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@merchant/delete',
  name: 'حذف المتجر',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Merchant',
    },
  ],
};

export const allPermissions: IPermission[] = [
  ALL_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  READ_PERMISSION,
  DELETE_PERMISSION,
];

export default {
  ALL_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  READ_PERMISSION,
  DELETE_PERMISSION,
};
