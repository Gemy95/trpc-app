import { registerEnumType } from '@nestjs/graphql';

export enum DELIVERY_PROVIDER_TYPES {
  shoppex = 'shoppex',
  merchant = 'merchant',
  default = 'default',
}

registerEnumType(DELIVERY_PROVIDER_TYPES, {
  name: 'DELIVERY_PROVIDER_TYPES',
});

export enum DELIVERY_PROVIDER_STATUS {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  banned = 'banned',
}

registerEnumType(DELIVERY_PROVIDER_STATUS, {
  name: 'DELIVERY_PROVIDER_STATUS',
});

export enum DELIVERY_PROVIDER_REQUEST_TYPES {
  data = 'data',
}

registerEnumType(DELIVERY_PROVIDER_REQUEST_TYPES, {
  name: 'DELIVERY_PROVIDER_REQUEST_TYPES',
});
