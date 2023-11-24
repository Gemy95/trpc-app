import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@menu-template-product/all',
  name: 'كل صلاحيات نموذج المنيو للمنتج',
  translation: [
    {
      _lang: 'en',
      name: `All MenuTemplateProduct's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@menu-template-product/create',
  name: 'انشاء نموذج المنيو للمنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Create menu template product',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@menu-template-product/update',
  name: 'تعديل نموذج المنيو للمنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Update menu template product',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@menu-template-product/read',
  name: 'قراة نموذج المنيو للمنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Read menu template product',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@menu-template-product/delete',
  name: 'حذف نموذج المنيو للمنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Delete menu template product',
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
