import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@ticket-tag/all',
  name: 'كل صلاحيات شعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: `All ticket-tag's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@ticket-tag/create',
  name: 'انشاء شعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Create ticket-tag',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@ticket-tag/update',
  name: 'تعديل شعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Update ticket-tag',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@ticket-tag/read',
  name: 'قراة شعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Read ticket-tag',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@ticket-tag/delete',
  name: 'حذف شعار التذاكر',
  translation: [
    {
      _lang: 'en',
      name: 'Delete ticket-tag',
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
