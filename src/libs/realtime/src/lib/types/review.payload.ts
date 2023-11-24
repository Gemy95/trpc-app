enum modelNameEnum {
  Merchant = 'Merchant',
  Product = 'Product',
  Branch = 'Branch',
}

enum approveStatusEnum {
  approved = 'approved',
  rejected = 'rejected',
  pending = 'pending',
}

export class Review {
  _id: string;
  modelName: modelNameEnum;
  reference: string; // refPath for modelName
  updatedBy: string; // ref user id
  approveStatus: approveStatusEnum;
}
