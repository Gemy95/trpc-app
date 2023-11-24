import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@ticket-tag-reason/all',
  name: 'كل صلاحيات اسباب الشعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: `All ticket-tag-reason's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@ticket-tag-reason/create',
  name: 'انشاء اسباب الشعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Create ticket-tag-reason',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@ticket-tag-reason/update',
  name: 'تعديل اسباب الشعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Update ticket-tag-reason',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@ticket-tag-reason/read',
  name: 'قراة اسباب الشعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Read ticket-tag-reason',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@ticket-tag-reason/delete',
  name: 'حذف اسباب الشعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Delete ticket-tag-reason',
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
