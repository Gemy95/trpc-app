import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@rating-scale/all',
  name: 'كل صلاحيات مقياس التصنيف',
  translation: [
    {
      _lang: 'en',
      name: `All rating-scale's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@rating-scale/create',
  name: 'انشاء مقياس التصنيف',
  translation: [
    {
      _lang: 'en',
      name: 'Create rating scale',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@rating-scale/update',
  name: 'تعديل مقياس التصنيف',
  translation: [
    {
      _lang: 'en',
      name: 'Update rating scale',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@rating-scale/read',
  name: 'قراة مقياس التصنيف',
  translation: [
    {
      _lang: 'en',
      name: 'Read rating scale',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@rating-scale/delete',
  name: 'حذف مقياس التصنيف',
  translation: [
    {
      _lang: 'en',
      name: 'Delete rating scale',
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
