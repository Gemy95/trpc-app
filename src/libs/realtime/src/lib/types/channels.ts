export enum Channels {
  //For ShoppexOrder Namespace
  order_ = 'order_', // order_{{OrderId}}
  branch_ = 'branch_', // branch_{{OrderId}}

  //For Merchant Namespace
  merchants_ = 'merchants_', // merchants_{{branchId}}
  owner_ = 'owner_', // owner_{{ownerId}}

  // request_ = 'request_',
  //For ShoppexOperation Namespace
  'transactionEventRoom' = 'transactionEventRoom',
  'requestEventRoom' = 'requestEventRoom',
  'ratingEventRoom' = 'ratingEventRoom',
  'orderEventRoom' = 'orderEventRoom',
  'reservationEventRoom' = 'reservationEventRoom',
}
