import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@discount/all',
  name: 'كل صلاحيات الخصم',
  translation: [
    {
      _lang: 'en',
      name: `All discount's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@discount/create',
  name: 'انشاء الخصم',
  translation: [
    {
      _lang: 'en',
      name: 'Create discount',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@discount/update',
  name: 'تعديل الخصم',
  translation: [
    {
      _lang: 'en',
      name: 'Update discount',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@discount/read',
  name: 'قراة الخصم',
  translation: [
    {
      _lang: 'en',
      name: 'Read discount',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@discount/delete',
  name: 'حذف الخصم',
  translation: [
    {
      _lang: 'en',
      name: 'Delete discount',
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
