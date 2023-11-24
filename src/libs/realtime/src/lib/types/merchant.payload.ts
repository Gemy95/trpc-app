export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class SocialMedia {
  url?: string;
  visits?: number = 0;
}

export class MerchantPayload {
  nameArabic: string;
  descriptionArabic?: string;
  nameEnglish: string;
  descriptionEnglish?: string;
  commercialRegistrationNumber: string;
  commercialName: string;
  hasDeliveryService?: boolean;
  uuid?: string;
  logo?: string;
  identificationImage?: string;
  commercialIdImage?: string;
  balance?: number;
  longitude?: number;
  latitude?: number;
  longitudeDelta?: number;
  latitudeDelta?: number;
  ownerId?: string;
  categoriesIds: string[];
  tagsIds: string[];
  cityId: string;
  gender?: Gender;
  twitterUrl?: SocialMedia;
  facebookUrl?: SocialMedia;
  websiteUrl?: SocialMedia;
  snapUrl?: SocialMedia;
  tiktokUrl?: SocialMedia;
  mobile?: string;
}
