import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@vehicle-brand/all',
  name: 'كل صلاحيات ماركة المركبة ',
  translation: [
    {
      _lang: 'en',
      name: `All Vehicle Brand's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@vehicle-brand/create',
  name: 'انشاء ماركة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Create vehicle brand',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@vehicle/update',
  name: 'تعديل ماركة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Update vehicle brand',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@vehicle-brand/read',
  name: 'قراة ماركة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Read vehicle brand',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@vehicle-brand/delete',
  name: 'حذف ماركة المركبة',
  translation: [
    {
      _lang: 'en',
      name: 'Delete vehicle brand',
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
