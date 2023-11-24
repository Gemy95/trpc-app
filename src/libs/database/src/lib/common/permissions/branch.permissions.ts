import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@merchant-branch/all',
  name: 'كل صلاحيات الفرع',
  translation: [
    {
      _lang: 'en',
      name: `All Branch's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@merchant-branch/create',
  name: 'انشاء فرع',
  translation: [
    {
      _lang: 'en',
      name: 'Create Branch',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@merchant-branch/update',
  name: 'تعديل الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Update Branch',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@merchant-branch/read',
  name: 'قراة الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Read Branch',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@merchant-branch/delete',
  name: 'حذف الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Branch',
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
