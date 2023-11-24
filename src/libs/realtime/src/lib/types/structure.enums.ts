export enum ShoppexNameSpaceEnum {
  ShoppexOrderNameSpace = 'ShoppexOrderNameSpace',
  ShoppexOperation = 'ShoppexOperation',
}

export enum ShoppexOrderRoomEnum {
  barnch = 'branch_{{Branch_ID}}',
  order = 'order_{{ORDER_ID}}',
  join = 'join',
  leave = 'leave',
}

export enum ShoppexOrderEventEnum {
  newOrder = 'new-order',
  updateOrder = 'update-order',
}

export enum EmitterTypeEnum {
  CLIENT = 'CLIENT',
  SERVER = 'SERVER',
}
