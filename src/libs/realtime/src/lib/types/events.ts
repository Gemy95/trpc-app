export enum EVENTS {
  'join' = 'join',
  'leave' = 'leave',

  //For ShoppexOrder Namespace
  'update-order' = 'update-order',
  'new-order' = 'new-order',

  //For Merchant Namespace And Branch Namespace
  'new-notification' = 'new-notification',
  'visibility-changed' = 'visibility-changed',
  'product-quantity-warning' = 'product-quantity-warning',

  //For Client Namespace
  'status-change' = 'status-change',

  //For ShoppexOperation Namespace
  'participants' = 'participants',
  'create_transactionEventRoom' = 'create_transactionEventRoom',
  'create_requestEventRoom' = 'create_requestEventRoom',
  'create_ratingEventRoom' = 'create_ratingEventRoom',
  'create_orderEventRoom' = 'create_orderEventRoom',
  'create_reservationEventRoom' = 'create_reservationEventRoom',
  'update_transactionEventRoom' = 'update_transactionEventRoom',
  'update_requestEventRoom' = 'update_requestEventRoom',
  'update_ratingEventRoom' = 'update_ratingEventRoom',
  'update_orderEventRoom' = 'update_orderEventRoom',
  'update_reservationEventRoom' = 'update_reservationEventRoom',
  'cancel_requestEventRoom' = 'cancel_requestEventRoom',
  'operation-new-notification' = 'operation-new-notification',
  // update_branch = 'update_branch',
  // update_request = 'update_request',
}
