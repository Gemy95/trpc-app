import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@Shoppex/all',
  name: 'كل صلاحيات شوبكس',
  translation: [
    {
      _lang: 'en',
      name: `All Shoppex's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@Shoppex/create',
  name: 'انشاء شوبكس',
  translation: [
    {
      _lang: 'en',
      name: 'Create Shoppex',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@Shoppex/update',
  name: 'تعديل شوبكس',
  translation: [
    {
      _lang: 'en',
      name: 'Update Shoppex',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@Shoppex/read',
  name: 'قراة شوبكس',
  translation: [
    {
      _lang: 'en',
      name: 'Read Shoppex',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@Shoppex/delete',
  name: 'حذف شوبكس',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Shoppex',
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
