import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@provider-owner/all',
  name: 'كل صلاحيات المالك ',
  translation: [
    {
      _lang: 'en',
      name: `All Provider Owner's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@provider-owner/create',
  name: 'انشاء المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Create provider owner',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@provider-owner/update',
  name: 'تعديل المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Update provider owner',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@provider-owner/read',
  name: 'قراة المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Read provider owner',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@provider-owner/delete',
  name: 'حذف المالك',
  translation: [
    {
      _lang: 'en',
      name: 'Delete provider owner',
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
