import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@table/all',
  name: 'كل صلاحيات الطاولة',
  translation: [
    {
      _lang: 'en',
      name: `All table's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@table/create',
  name: 'انشاء الطاولة',
  translation: [
    {
      _lang: 'en',
      name: 'Create table',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@table/update',
  name: 'تعديل الطاولة',
  translation: [
    {
      _lang: 'en',
      name: 'Update table',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@table/read',
  name: 'قراة الطاولة',
  translation: [
    {
      _lang: 'en',
      name: 'Read table',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@table/delete',
  name: 'حذف الطاولة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete table',
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
