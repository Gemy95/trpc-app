import mongoose from 'mongoose';
import { MENU_UPLOAD_STATUS, MERCHANT_STATUS, VISIBILITY_STATUS } from '../../../common/constants/merchant';
import { FindAllMerchantType } from '../../../common/types/merchant.types';
import { Merchant } from '../../../models';

const merchant = {
  _id: '2db76c54-fa3f-4e81-8bd0-5db1f9248ac3',
  name: 'newMerchant',
  description: 'This is a newly created Merchant for test',
  commercialRegistrationNumber: '11234056',
  commercialName: 'Merchant',
  branchesNumber: 0,
  hasDeliveryService: true,
  address: '88 Floor 1',
  uuid: 'e174e0fa-02af-4ac8-9c60-631a7b87309d',
  status: MERCHANT_STATUS.APPROVED_STATUS,
  visibility_status: VISIBILITY_STATUS.OFFLINE_STATUS,
  ownerId: '3ea97faa-8a95-487d-af99-4dab3f4c6b0f',
  logo: 'https://www.freepik.com/free-photos-vectors/logo',
  identificationImage: 'https://www.freepik.com/free-photos-vectors/royal-logo',
  commercialIdImage:
    'https://www.istockphoto.com/vector/geometric-vintage-creative-crown-abstract-logo-design-vector-template-vintage-crown-gm1027575248-275493936',
  balance: 0,
  location: {
    type: 'Point',
    coordinates: [46.000001, 25.0],
  },
  locationDelta: [46.000001, 25.0],
  isDeleted: false,
  translation: [
    {
      _lang: 'en',
      name: 'Merchant translation',
      description: 'Get this for translation',
    },
  ],
  categoriesIds: ['d7bc9710-da3a-4d8c-9304-7419f83a90c0'],
  tagsIds: ['634ac5f3-cffa-40cd-94b0-d7df04ee76fa'],
  cityId: '430ed0e7-f525-41be-9451-26927acb5a7a',
  productsPriceRange: 0,
  twitterUrl: {
    url: 'https://google.com/',
    visits: 1,
  },
  facebookUrl: {
    url: 'https://google.com/',
    visits: 1,
  },
  websiteUrl: {
    url: 'https://google.com/',
    visits: 1,
  },
  snapUrl: {
    url: 'https://google.com/',
    visits: 1,
  },
  tiktokUrl: {
    url: 'https://google.com/',
    visits: 1,
  },
  mobile: '+2011111111',
  approvedBy: new mongoose.Types.ObjectId('62b362c3e56c65b1644862c1'),
  inReview: true,
  createdAt: new Date(),
  bankAccount: {
    _id: '',
    bank: '',
    nameOfPerson: '',
    accountNumber: '1233333333444',
    iban: 'xyz',
    accountType: 'individual',
    accountImageUrl: '',
    createdAt: '',
    updatedAt: '',
  },
  subscriptions: {
    amount: 1,
    started_subscribe_date: new Date(),
    next_subscribe_payment_date: new Date(),
  },
  menuTemplateId: '',
  lowestPriceToOrder: 10,
  minimum_delivery_price: 1,
  status_before_deleted: 'pending',
  deletedAt: new Date(),
  menu_upload_status: MENU_UPLOAD_STATUS.PENDING_STATUS,
  menuUpload: { mobile: '1111111111', images: [{ url: 'http' }], notes: 'from back end' },
};

export const merchantStub = (): Merchant => {
  return merchant;
};

export const createMerchantStub = (): { message; newMerchant: Merchant } => {
  return {
    message: 'Successfully created',
    newMerchant: merchant,
  };
};

export const merchantFindAllSub = (): FindAllMerchantType => {
  return {
    merchants: [merchant],
    page: 0,
    pages: 1,
    length: 21,
    rejected: 0,
    approved: 0,
    pending: 0,
  };
};
