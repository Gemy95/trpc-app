export const STATUS_ENUM = ['active', 'inActive'] as const;
export type CityStatus = (typeof STATUS_ENUM)[number];

export const STATUS = {
  active: 'active',
  inActive: 'inActive',
};

export const ROLE_TO_QUERY = {
  '*': {
    status: 'active',
  },
  admin: {},
};
