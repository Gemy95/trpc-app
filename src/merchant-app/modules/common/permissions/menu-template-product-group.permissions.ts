import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@menu-template-product-group/all',
  name: 'كل صلاحيات نموذج المنيو اضافات المنتج',
  translation: [
    {
      _lang: 'en',
      name: `All MenuTemplateProductGroup's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@menu-template-product-group/create',
  name: 'انشاء نموذج المنيو اضافات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Create menu template product group',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@menu-template-product-group/update',
  name: 'تعديل نموذج المنيو اضافات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Update menu template product group',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@menu-template-product-group/read',
  name: 'قراة نموذج المنيو اضافات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Read menu template product group',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@menu-template-product-group/delete',
  name: 'حذف نموذج المنيو اضافات المنتج',
  translation: [
    {
      _lang: 'en',
      name: 'Delete menu template product group',
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
