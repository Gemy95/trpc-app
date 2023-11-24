import { Merchant } from '../../models';

export type FindAllMerchantType = {
  merchants: Merchant[];
  page: number;
  pages: number;
  length: number;
  rejected: number;
  approved: number;
  pending: number;
};
