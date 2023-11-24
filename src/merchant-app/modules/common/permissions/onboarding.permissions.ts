import { IPermission } from '../interfaces/permissions.interface';

export const ALL_PERMISSION: IPermission = {
  value: '@onboarding/all',
  name: 'كل صلاحيات ',
  translation: [
    {
      _lang: 'en',
      name: `All onboarding's Permissions`,
    },
  ],
};

export const CREATE_PERMISSION: IPermission = {
  value: '@onboarding/create',
  name: 'انشاء ',
  translation: [
    {
      _lang: 'en',
      name: 'Create onboarding',
    },
  ],
};

export const UPDATE_PERMISSION: IPermission = {
  value: '@onboarding/update',
  name: 'تعديل الاعداد',
  translation: [
    {
      _lang: 'en',
      name: 'Update onboarding',
    },
  ],
};

export const READ_PERMISSION: IPermission = {
  value: '@onboarding/read',
  name: 'قراة الاعداد',
  translation: [
    {
      _lang: 'en',
      name: 'Read onboarding',
    },
  ],
};

export const DELETE_PERMISSION: IPermission = {
  value: '@onboarding/delete',
  name: 'حذف الاعداد',
  translation: [
    {
      _lang: 'en',
      name: 'Delete onboarding',
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
