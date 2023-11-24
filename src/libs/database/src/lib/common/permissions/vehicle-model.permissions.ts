import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@vehicle-model/all',
  name: 'كل صلاحيات موديل المركبة ',
  translation: [
    {
      _lang: 'en',
      name: `All Vehicle Model's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@vehicle-model/create',
  name: 'انشاء موديل المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Create vehicle model',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@vehicle-model/update',
  name: 'تعديل موديل المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Update vehicle model',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@vehicle-model/read',
  name: 'قراة موديل المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Read vehicle model',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@vehicle model/delete',
  name: 'حذف موديل المركبه',
  translation: [
    {
      _lang: 'en',
      name: 'Delete vehicle model',
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
