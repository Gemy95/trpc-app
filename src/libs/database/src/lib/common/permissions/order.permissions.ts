import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@order/all',
  name: 'كل صلاحيات طلب',
  translation: [
    {
      _lang: 'en',
      name: `All Order's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@order/create',
  name: 'انشاء طلب',
  translation: [
    {
      _lang: 'en',
      name: 'Create Order',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@order/update',
  name: 'تعديل طلب',
  translation: [
    {
      _lang: 'en',
      name: 'Update Order',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@order/read',
  name: 'قراة طلب',
  translation: [
    {
      _lang: 'en',
      name: 'Read Order',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@order/delete',
  name: 'حذف طلب',
  translation: [
    {
      _lang: 'en',
      name: 'Delete Order',
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
