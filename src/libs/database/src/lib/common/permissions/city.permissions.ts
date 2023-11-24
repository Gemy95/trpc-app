import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@city/all',
  name: 'كل صلاحيات المدينة',
  translation: [
    {
      _lang: 'en',
      name: `All City's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@city/create',
  name: 'انشاء المدينة',
  translation: [
    {
      _lang: 'en',
      name: 'Create City',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@city/update',
  name: 'تعديل المدينة',
  translation: [
    {
      _lang: 'en',
      name: 'Update City',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@city/read',
  name: 'قراة المدينة',
  translation: [
    {
      _lang: 'en',
      name: 'Read City',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@city/delete',
  name: 'حذف المدينة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete City',
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
