import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@department/all',
  name: 'كل صلاحيات القسم',
  translation: [
    {
      _lang: 'en',
      name: `All Department Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@department/create',
  name: 'انشاء قسم',
  translation: [
    {
      _lang: 'en',
      name: 'Create Department',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@department/update',
  name: 'تعديل قسم',
  translation: [
    {
      _lang: 'en',
      name: 'Update Department',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@department/read',
  name: 'قرأة قسم',
  translation: [
    {
      _lang: 'en',
      name: 'Read Department',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@department/delete',
  name: 'حذف قسم',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Department',
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
