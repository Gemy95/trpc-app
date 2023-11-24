import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@menu-template/all',
  name: 'كل صلاحيات نموذج المنيو',
  translation: [
    {
      _lang: 'en',
      name: `All MenuTemplate's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@menu-template/create',
  name: 'انشاء نموذج المنيو',
  translation: [
    {
      _lang: 'en',
      name: 'Create menu template',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@menu-template/update',
  name: 'تعديل نموذج المنيو',
  translation: [
    {
      _lang: 'en',
      name: 'Update menu template',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@menu-template/read',
  name: 'قراة نموذج المنيو',
  translation: [
    {
      _lang: 'en',
      name: 'Read menu template',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@menu-template/delete',
  name: 'حذف نموذج المنيو',
  translation: [
    {
      _lang: 'en',
      name: 'Delete menu template',
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
