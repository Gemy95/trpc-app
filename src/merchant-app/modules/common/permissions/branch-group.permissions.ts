import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@merchant-branch-group/all',
  name: 'كل صلاحيات الفرع',
  translation: [
    {
      _lang: 'en',
      name: `All BranchGroup's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@merchant-branch-group/create',
  name: 'انشاء فرع',
  translation: [
    {
      _lang: 'en',
      name: 'Create Branch Group',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@merchant-branch-group/update',
  name: 'تعديل الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Update Branch Group',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@merchant-branch-group/read',
  name: 'قراة الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Read Branch Group',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@merchant-branch-group/delete',
  name: 'حذف الفرع',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Branch Group',
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
