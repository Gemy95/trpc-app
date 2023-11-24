import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@category/all',
  name: 'كل صلاحيات الصنف',
  translation: [
    {
      _lang: 'en',
      name: `All Category's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@category/create',
  name: 'انشاء الصنف',
  translation: [
    {
      _lang: 'en',
      name: 'Create Category',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@category/update',
  name: 'تعديل الصنف',
  translation: [
    {
      _lang: 'en',
      name: 'Update Category',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@category/read',
  name: 'قراة الصنف',
  translation: [
    {
      _lang: 'en',
      name: 'Read Category',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@category/delete',
  name: 'حذف الصنف',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Category',
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
