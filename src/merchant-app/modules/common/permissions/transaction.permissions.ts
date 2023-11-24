import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@transaction/all',
  name: 'كل صلاحيات الدفع و التحويلات',
  translation: [
    {
      _lang: 'en',
      name: `All transaction's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@transaction/create',
  name: 'انشاء الدفع و التحويلات',
  translation: [
    {
      _lang: 'en',
      name: 'Create transaction',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@transaction/update',
  name: 'تعديل الدفع و التحويلات',
  translation: [
    {
      _lang: 'en',
      name: 'Update transaction',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@transaction/read',
  name: 'قراة الدفع و التحويلات',
  translation: [
    {
      _lang: 'en',
      name: 'Read transaction',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@transaction/delete',
  name: 'حذف الدفع و التحويلات',
  translation: [
    {
      _lang: 'en',
      name: 'Delete transaction',
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
