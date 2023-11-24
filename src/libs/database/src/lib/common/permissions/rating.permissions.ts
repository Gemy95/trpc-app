import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@rating/all',
  name: 'كل صلاحيات التقييم',
  translation: [
    {
      _lang: 'en',
      name: `All Rating's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@rating/create',
  name: 'انشاء التقييم',
  translation: [
    {
      _lang: 'en',
      name: 'Create Rating',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@rating/update',
  name: 'تعديل التقييم',
  translation: [
    {
      _lang: 'en',
      name: 'Update Rating',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@rating/read',
  name: 'قراة التقييم',
  translation: [
    {
      _lang: 'en',
      name: 'Read Rating',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@rating/delete',
  name: 'حذف التقييم',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Rating',
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
