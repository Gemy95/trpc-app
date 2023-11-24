import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@country/all',
  name: 'كل صلاحيات الدولة',
  translation: [
    {
      _lang: 'en',
      name: `All Country's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@country/create',
  name: 'انشاء الدولة',
  translation: [
    {
      _lang: 'en',
      name: 'Create Country',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@country/update',
  name: 'تعديل الدولة',
  translation: [
    {
      _lang: 'en',
      name: 'Update Country',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@country/read',
  name: 'قراة الدولة',
  translation: [
    {
      _lang: 'en',
      name: 'Read Country',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@country/delete',
  name: 'حذف الدولة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Country',
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
