//Notification
export const NOTIFICATION_QUEUE = 'Notifications';
export const CREATE_ORDER_NOTIFICATION_PROCESS = 'send new order notification';
export const CANCEL_ORDER_NOTIFICATION_PROCESS = 'send canceled order notification';
export const REJECTED_ORDER_NOTIFICATION_PROCESS = 'send rejected order notification';
export const ACCEPT_ORDER_NOTIFICATION_PROCESS = 'send accepted order notification';
export const READY_ORDER_NOTIFICATION_PROCESS = 'send ready order notification';
export const DELIVERED_ORDER_NOTIFICATION_PROCESS = 'send delivered order notification';
export const ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS = 'send order product quantity notification';
export const ON_WAY_TO_CLIENT_ORDER_NOTIFICATION_PROCESS = 'send on way to client order notification';
export const ARRIVED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS = 'send arrived to client order notification';
export const CLIENT_NOT_RESPOND_ORDER_NOTIFICATION_PROCESS = 'send client not respond order notification';
export const CLIENT_NOT_DELIVERED_ORDER_NOTIFICATION_PROCESS = 'send not delivered client order notification';
export const DELIVERED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS = 'send delivered client order notification';

export const REQUEST_NOTIFICATION_PROCESS = 'request notification';
export const PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS = 'product request approval notification';
export const MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS = 'merchant request approval notification';
export const BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS = 'branch request approval notification';

//Order
export const ORDER_QUEUE = 'Order';
export const CREATE_ORDER_PROCESSOR = 'create order';
export const ACCEPT_ORDER_PROCESSOR = 'accept order';
export const READY_ORDER_PROCESSOR = 'ready order';

//Owner
export const PROVIDER_OWNER_QUEUE = 'ProviderOwner';
export const SEND_EMAIL_PROCESSOR = 'SendEmail';

//Client
export const CLIENT_QUEUE = 'Client';
export const CHANGE_CLIENT_STATUS_PROCESSOR = 'changeClientStatus';
