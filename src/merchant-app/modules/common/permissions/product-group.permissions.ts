import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@product-group/all',
  name: 'كل صلاحيات فئات المنتج',
  translation: [
    {
      _lang: 'en',
      name: `All product group's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@product-group/create',
  name: 'انشاء فئة للمنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Create product group',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@product-group/update',
  name: 'تعديل فئات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Update product group',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@product-group/read',
  name: 'قراة فئات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Read product group',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@product-group/delete',
  name: 'حذف فئات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Delete product group',
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
