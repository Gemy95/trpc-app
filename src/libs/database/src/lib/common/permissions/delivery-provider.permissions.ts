import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@delivery-provider/all',
  name: 'كل صلاحيات مزود التسليم ',
  translation: [
    {
      _lang: 'en',
      name: `All Delivery Provider's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@delivery-provider/create',
  name: 'انشاء مزود التسليم',
  translation: [
    {
      _lang: 'en',
      name: 'Create delivery provider',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@delivery-provider/update',
  name: 'تعديل مزود التسليم',
  translation: [
    {
      _lang: 'en',
      name: 'Update delivery provider',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@delivery-provider/read',
  name: 'قراة مزود التسليم',
  translation: [
    {
      _lang: 'en',
      name: 'Read delivery provider',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@delivery-provider/delete',
  name: 'حذف مزود التسليم',
  translation: [
    {
      _lang: 'en',
      name: 'Delete delivery provider',
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
