import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@merchant-employee-manager/all',
  name: 'كل صلاحيات الموظف المدير',
  translation: [
    {
      _lang: 'en',
      name: `All MerchantEmployeeManager's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@merchant-employee-manager/create',
  name: 'المدير انشاء الموظف المدير',
  translation: [
    {
      _lang: 'en',
      name: 'Create Merchant Employee Manager',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@merchant-employee-manager/update',
  name: 'تعديل الموظف المدير',
  translation: [
    {
      _lang: 'en',
      name: 'Update Merchant Employee Manager',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@merchant-employee-manager/read',
  name: ' قراة الموظف المدير',
  translation: [
    {
      _lang: 'en',
      name: 'Read Merchant Employee Manager',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@merchant-employee-manager/delete',
  name: 'حذف الموظف المدير',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Merchant Employee Manager',
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
