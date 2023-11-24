import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@reservation/all',
  name: 'كل صلاحيات الحجز',
  translation: [
    {
      _lang: 'en',
      name: `All reservation's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@reservation/create',
  name: 'انشاء حجز',
  translation: [
    {
      _lang: 'en',
      name: 'Create reservation',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@reservation/update',
  name: 'تعديل الحجز',
  translation: [
    {
      _lang: 'en',
      name: 'Update reservation',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@reservation/read',
  name: 'قراة الحجز',
  translation: [
    {
      _lang: 'en',
      name: 'Read reservation',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@reservation/delete',
  name: 'حذف الحجز',
  translation: [
    {
      _lang: 'en',
      name: 'Delete reservation',
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
