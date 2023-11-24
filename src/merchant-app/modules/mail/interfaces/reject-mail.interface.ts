import { Branch, Merchant, Product } from '../../models';

export interface IRejectMail {
  merchant?: Partial<Merchant>;
  product?: Partial<Product>;
  branch?: Partial<Branch>;
}
