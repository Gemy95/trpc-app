import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@merchant-employee/all',
  name: 'كل صلاحيات الموظف',
  translation: [
    {
      _lang: 'en',
      name: `All MerchantEmployee's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@merchant-employee/create',
  name: 'انشاء الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Create Merchant Employee',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@merchant-employee/update',
  name: 'تعديل الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Update Merchant Employee',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@merchant-employee/read',
  name: 'قراة الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Read Merchant Employee',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@merchant-employee/delete',
  name: 'حذف الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Merchant Employee',
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
