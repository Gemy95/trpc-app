import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@tag/all',
  name: 'كل صلاحيات العلامات',
  translation: [
    {
      _lang: 'en',
      name: `All tag's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@tag/create',
  name: 'انشاء العلامات',
  translation: [
    {
      _lang: 'en',
      name: 'Create tag',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@tag/update',
  name: 'تعديل العلامات',
  translation: [
    {
      _lang: 'en',
      name: 'Update tag',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@tag/read',
  name: 'قراة العلامات',
  translation: [
    {
      _lang: 'en',
      name: 'Read tag',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@tag/delete',
  name: 'حذف العلامات',
  translation: [
    {
      _lang: 'en',
      name: 'Delete tag',
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
