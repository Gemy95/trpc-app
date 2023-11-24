import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@vehicle-year/all',
  name: 'كل صلاحيات سنة المركبة ',
  translation: [
    {
      _lang: 'en',
      name: `All Vehicle Year's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@vehicle-year/create',
  name: 'انشاء سنة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Create vehicle year',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@vehicle-year/update',
  name: 'تعديل سنة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Update vehicle year',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@vehicle-year/read',
  name: 'قراة سنة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Read vehicle year',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@vehicle-year/delete',
  name: 'حذف سنة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete vehicle year',
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
