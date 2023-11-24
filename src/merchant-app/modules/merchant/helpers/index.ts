import * as genOTP from 'gen-totp';

export const createMerchantId = (ownerId: string, merchantName: string): string => {
  const prefix: string = merchantName.toLowerCase().slice(0, 4);
  const num: number = genOTP(ownerId);

  return `${prefix}-${num}`;
};
