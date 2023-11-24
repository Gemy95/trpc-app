import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@employee/all',
  name: 'كل صلاحيات الموظف ',
  translation: [
    {
      _lang: 'en',
      name: `All Employee's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@employee/create',
  name: 'انشاء الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Create',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@employee/update',
  name: 'تعديل الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Update employee',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@employee/read',
  name: 'قراة الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Read employee',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@employee/delete',
  name: 'حذف الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Delete employee',
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
