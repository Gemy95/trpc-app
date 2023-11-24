import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@branch-category/all',
  name: 'كل صلاحيات فئات الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'All permission for branch category',
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@branch-category/create',
  name: 'انشاء فئة للفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Create Branch Category',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@branch-category/update',
  name: 'تعديل فئة للفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Update Branch Category',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@branch-category/read',
  name: 'قراء فئة الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Read Branch Category',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@branch-category/delete',
  name: 'حذف فئة من الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Branch Category',
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
