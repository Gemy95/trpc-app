import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@coupon/all',
  name: 'كل صلاحيات الكوبون',
  translation: [
    {
      _lang: 'en',
      name: 'All permission for Coupon',
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@coupon/create',
  name: 'انشاء الكوبون',
  translation: [
    {
      _lang: 'en',
      name: 'Create Coupon',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@coupon/update',
  name: 'تعديل الكوبون',
  translation: [
    {
      _lang: 'en',
      name: 'Update Coupon',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@coupon/read',
  name: 'قراءة الكوبون',
  translation: [
    {
      _lang: 'en',
      name: 'Read Coupon',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@coupon/delete',
  name: 'حذف الكوبون',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Coupon',
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
