import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@provider-employee/all',
  name: 'كل صلاحيات الموظف ',
  translation: [
    {
      _lang: 'en',
      name: `All Provider Employee's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@provider-employee/create',
  name: 'انشاء الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Create provider employee',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@provider-employee/update',
  name: 'تعديل الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Update provider employee',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@provider-employee/read',
  name: 'قراة الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Read provider employee',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@provider-employee/delete',
  name: 'حذف الموظف',
  translation: [
    {
      _lang: 'en',
      name: 'Delete provider employee',
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
