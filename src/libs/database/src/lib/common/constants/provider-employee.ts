export const PROVIDER_EMPLOYEE_ACTIVE_STATUS = 'active';
export const PROVIDER_EMPLOYEE_INACTIVE_STATUS = 'inActive';
export const PROVIDER_EMPLOYEE_BANNED_STATUS = 'banned';

export enum PROVIDER_EMPLOYEE_STATUS {
  PROVIDER_EMPLOYEE_ACTIVE_STATUS = 'active',
  PROVIDER_EMPLOYEE_INACTIVE_STATUS = 'inActive',
  PROVIDER_EMPLOYEE_BANNED_STATUS = 'banned',
}

export const REDIS_PROVIDER_EMPLOYEE_NAME_SPACE = 'redis_provider_employee_name_space';

export enum PROVIDER_EMPLOYEE_JOB {
  CASHIER = 'cashier',
  SELLER = 'seller',
  MANAGER = 'manager',
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  DELIVERY = 'delivery',
  CHEF = 'chef',
}

export const CASHIER = PROVIDER_EMPLOYEE_JOB.CASHIER;
export const SELLER = PROVIDER_EMPLOYEE_JOB.SELLER;
export const MANAGER = PROVIDER_EMPLOYEE_JOB.MANAGER;
export const GUEST = PROVIDER_EMPLOYEE_JOB.GUEST;
export const EMPLOYEE = PROVIDER_EMPLOYEE_JOB.EMPLOYEE;
export const DELIVERY = PROVIDER_EMPLOYEE_JOB.DELIVERY;
export const CHEF = PROVIDER_EMPLOYEE_JOB.CHEF;
