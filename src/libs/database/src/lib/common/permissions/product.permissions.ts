import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@product/all',
  name: 'كل صلاحيات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'All permission for product',
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@product/create',
  name: 'انشاء منتج',
  translation: [
    {
      _lang: 'en',
      name: 'Create Product',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@product/update',
  name: 'تعديل منتج',
  translation: [
    {
      _lang: 'en',
      name: 'Update Product',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@product/read',
  name: 'قراءة منتج',
  translation: [
    {
      _lang: 'en',
      name: 'Read Product',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@product/delete',
  name: 'حذف منتج',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Product',
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
