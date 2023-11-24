import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@owner/all',
  name: 'كل صلاحيات المالك',
  translation: [
    {
      _lang: 'en',
      name: `All Owner's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@owner/create',
  name: 'انشاء المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Create Owner',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@owner/update',
  name: 'تعديل المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Update Owner',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@owner/read',
  name: 'قراة المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Read Owner',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@owner/delete',
  name: 'حذف المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Owner',
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
