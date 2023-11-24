import { Transaction } from '../../../models';

const transaction = {
  _id: '62caf6a83bef06add42539e8',
  operationId: '68584762',
  amount: 46,
  tax: 15,
  commission: 0,
  to: '62b362c3e56c65b1644862c1',
  from: '62b2d29d80951e5f4c81c99f',
  orderId: '62d7caa15ad0eb82a2b8dd59',
  status: 'delivered',
  createdAt: new Date(),
  updatedAt: new Date(),
  operationType: 'deserved',
  __v: 0,
};

export const transactionStub = (): Transaction => {
  return transaction;
};

export const findAllStub = (): { transactions: Transaction[]; page: number; pages: number; length: number } => {
  return { transactions: [transaction], page: 1, pages: 5, length: 10 };
};

export const findAllByMerchantIdStub = (): {
  transactions: Transaction[];
  page: number;
  pages: number;
  length: number;
} => {
  return { transactions: [transaction], page: 1, pages: 5, length: 10 };
};

export const findOneStub = (): Transaction => {
  return transaction;
};

export const updateStub = (): Transaction => {
  return transaction;
};
