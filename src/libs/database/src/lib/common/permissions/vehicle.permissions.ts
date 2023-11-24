import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@vehicle/all',
  name: 'كل صلاحيات المركبة ',
  translation: [
    {
      _lang: 'en',
      name: `All Vehicle's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@vehicle/create',
  name: 'انشاء المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Create vehicle',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@vehicle/update',
  name: 'تعديل المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Update vehicle',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@vehicle/read',
  name: 'قراة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Read vehicle',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@vehicle/delete',
  name: 'حذف المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete vehicle',
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
