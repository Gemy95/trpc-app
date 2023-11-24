// // build statuses
// export const PENDING_STATUS = 'pending';
// export const APPROVED_STATUS = 'approved';
// export const REJECTED_STATUS = 'rejected';

// // release statuses
// export const ACTIVE_STATUS = 'active';
// export const INACTIVE_STATUS = 'inActive';
// export const BANNED_STATUS = 'banned';

// export enum BUILD_STATUS {
//   PENDING_STATUS = 'pending',
//   APPROVED_STATUS = 'approved',
//   REJECTED_STATUS = 'rejected',
// }

// export enum RELEASE_STATUS {
//   ACTIVE_STATUS = 'active',
//   INACTIVE_STATUS = 'inActive',
//   BANNED_STATUS = 'banned',
// }

// visibility statuses
export const ONLINE_STATUS = 'online';
export const OFFLINE_STATUS = 'offline';
export const BUSY_STATUS = 'busy';
export const CLOSED_STATUS = 'closed';

export enum VISIBILITY_STATUS {
  ONLINE_STATUS = 'online',
  OFFLINE_STATUS = 'offline',
  BUSY_STATUS = 'busy',
  CLOSED_STATUS = 'closed',
}

export enum BRANCH_RESERVATION_STATUS {
  NONE_STATUS = 'none',
  PENDING_STATUS = 'pending',
  APPROVED_STATUS = 'approved',
  REJECTED_STATUS = 'rejected',
}

export enum DAYS {
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
}

export enum USER_TYPES {
  MERHCNAT_EMPLOYEE = 'MERHCNAT_EMPLOYEE',
  SHOPPEX_EMPLOYEE = 'SHOPPEX_EMPLOYEE',
  SYSTEM = 'SYSTEM',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export enum RESERVATION_USER_TYPES {
  MERHCNAT_EMPLOYEE = 'MERHCNAT_EMPLOYEE',
  SHOPPEX_EMPLOYEE = 'SHOPPEX_EMPLOYEE',
  CLIENT = 'CLIENT',
}

export enum BRANCH_STATUS {
  PENDING_STATUS = 'pending',
  APPROVED_STATUS = 'approved',
  REJECTED_STATUS = 'rejected',
  BANNED_STATUS = 'banned',
}

export enum BRANCH_STATUS_TAGS {
  PRODUCTION_READY_STATUS = 'production_ready',
  STAGING_READY_STATUS = 'staging_ready',
  UNDER_REVIEW_STATUS = 'under_review',
  NEED_STATUS = 'need_action',
  REVIEW_DOCS_STATUS = 'review_docs',
}

export enum BRANCH_REQUEST_TYPES {
  PUBLISH = 'publish',
  RESERVATION = 'reservation',
  DATA = 'data',
}
