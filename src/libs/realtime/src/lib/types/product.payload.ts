export enum STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

export class ProductImageDto {
  url: string;
  titleArabic?: string;
  titleEnglish?: string;
  descriptionArabic?: string;
  descriptionEnglish?: string;
  new?: boolean;
}

export class ProductPayload {
  nameArabic: string;
  nameEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  preparationTime: number;
  productGroupsIds?: string[];
  categoriesIds: string[];
  branchesIds: string[];
  images?: ProductImageDto[];
  mainImage?: ProductImageDto;
  price: number;
  status: STATUS;
  calories: number;
}
