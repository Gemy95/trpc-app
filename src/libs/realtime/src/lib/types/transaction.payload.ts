export enum TRANSACTION_TYPE {
  DESERVED = 'deserved',
  DISCOUNT = 'discount',
  Reward = 'reward',
  Compensation = 'compensation',
  adjustment = 'adjustment',
  Refund = 'refund',
}

export class TransactionPayload {
  operationId: string;
  amount: number;
  tax: number;
  commission: number;
  to: string; // ref merchant id
  from: string; // ref client id
  operationType: TRANSACTION_TYPE;
  orderId: string; // ref order id
  status: string;
}
