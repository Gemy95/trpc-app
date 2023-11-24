import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@bank/all',
  name: 'كل صلاحيات البنك',
  translation: [
    {
      _lang: 'en',
      name: `All Bank's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@bank/create',
  name: 'انشاء البنك',
  translation: [
    {
      _lang: 'en',
      name: 'Create bank',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@bank/update',
  name: 'تعديل البنك',
  translation: [
    {
      _lang: 'en',
      name: 'Update bank',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@bank/read',
  name: 'قراة البنك',
  translation: [
    {
      _lang: 'en',
      name: 'Read bank',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@bank/delete',
  name: 'حذف البنك',
  translation: [
    {
      _lang: 'en',
      name: 'Delete bank',
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
