import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@driver/all',
  name: 'كل صلاحيات السائق ',
  translation: [
    {
      _lang: 'en',
      name: `All Driver's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@driver/create',
  name: 'انشاء السائق',
  translation: [
    {
      _lang: 'en',
      name: 'Create driver',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@driver/update',
  name: 'تعديل السائق',
  translation: [
    {
      _lang: 'en',
      name: 'Update driver',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@driver/read',
  name: 'قراة السائق',
  translation: [
    {
      _lang: 'en',
      name: 'Read driver',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@driver/delete',
  name: 'حذف السائق',
  translation: [
    {
      _lang: 'en',
      name: 'Delete driver',
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
