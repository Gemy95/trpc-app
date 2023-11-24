// build statuses
// export const PENDING_STATUS = 'pending';
// export const APPROVED_STATUS = 'approved';
// export const REJECTED_STATUS = 'rejected';

import { registerEnumType } from '@nestjs/graphql';

// // release statuses
// export const STAGING_STATUS = 'staging';
// export const PRODUCTION_STATUS = 'production';
// export const TESTING_STATUS = 'testing';

// export enum BUILD_STATUS {
//   PENDING_STATUS = 'pending',
//   APPROVED_STATUS = 'approved',
//   REJECTED_STATUS = 'rejected',
// }

// export enum RELEASE_STATUS {
//   STAGING_STATUS = 'staging',
//   PRODUCTION_STATUS = 'production',
//   TESTING_STATUS = 'testing',
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

export enum MERCHANT_STATUS {
  PENDING_STATUS = 'pending',
  APPROVED_STATUS = 'approved',
  REJECTED_STATUS = 'rejected',
  BANNED_STATUS = 'banned',
}

export enum MERCHANT_STATUS_TAGS {
  PRODUCTION_READY_STATUS = 'production_ready',
  STAGING_READY_STATUS = 'staging_ready',
  UNDER_REVIEW_STATUS = 'under_review',
  NEED_STATUS = 'need_action',
  REVIEW_DOCS_STATUS = 'review_docs',
}

export enum BANK_ACCOUNT_TYPE {
  individual,
  company,
  foundation,
}

registerEnumType(BANK_ACCOUNT_TYPE, {
  name: 'BANK_ACCOUNT_TYPE',
});

export enum MERCHANT_REQUEST_TYPES {
  BANK_ACCOUNT = 'bank_account',
  DATA = 'data',
}

export enum MENU_UPLOAD_STATUS {
  PENDING_STATUS = 'pending',
  IN_PROGRESS_STATUS = 'inProgress',
  DONE_STATUS = 'done',
  REJECTED_STATUS = 'rejected',
}
