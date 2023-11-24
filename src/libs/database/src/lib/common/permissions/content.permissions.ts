import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@content/all',
  name: 'كل صلاحيات ',
  translation: [
    {
      _lang: 'en',
      name: `All content's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@content/create',
  name: 'انشاء المحتوي',
  translation: [
    {
      _lang: 'en',
      name: 'Create content',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@content/update',
  name: 'تعديل المحتوي',
  translation: [
    {
      _lang: 'en',
      name: 'Update content',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@content/read',
  name: 'قراة المحتوي',
  translation: [
    {
      _lang: 'en',
      name: 'Read content',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@content/delete',
  name: 'حذف المحتوي',
  translation: [
    {
      _lang: 'en',
      name: 'Delete content',
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
