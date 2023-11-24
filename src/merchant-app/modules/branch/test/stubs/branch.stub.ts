import mongoose from 'mongoose';
import { Branch } from '../../../models';
import { DAYS } from '../../../common/constants/branch.constants';

const branch = {
  _id: '6345ef95eeab41b10728d578',
  name: 'ali',
  search: [''],
  mobile: '01017431767',
  address: '',
  cityId: new mongoose.Types.ObjectId('6345ef95eeab41b10728d578'),
  merchantId: new mongoose.Types.ObjectId('6345ef95eeab41b10728d578'),
  ownerId: new mongoose.Types.ObjectId('6345ef95eeab41b10728d578'),
  visibleToClients: true,
  status: 'pending',
  status_tags: 'production_ready',
  visibility_status: 'online',
  isFreezing: false,
  location: {
    type: '',
    coordinates: [1, 2],
  },
  locationDelta: [1, 2],
  workingHours: [
    {
      day: '',
      durations: [
        {
          startAt: '',
          endAt: '',
        },
      ],
    },
  ],
  reservationsInstructions: '',
  pickupInstructions: '',
  deliveryInstructions: '',
  translation: [
    {
      _lang: 'en',
      name: 'test',
    },
  ],
  isDeleted: false,
  client_visits: 15,
  approvedBy: '',
  reservationsSettings: {
    isEnabledWaitingList: true,
    waitingListCapacity: 10,
    initialPrice: 10,
    averageReservationPeriod: 60,
    separationTimeBetweenEachReservation: 2,
    clientsInstructions: [
      {
        content: 'ttt',
        translation: [
          {
            _lang: 'en',
            name: 'ttt',
            content: 'asd',
          },
        ],
      },
    ],
    branchInstructions: [
      {
        content: 'ttt',
        translation: [
          {
            _lang: 'en',
            name: 'ttt',
            content: 'asd',
          },
        ],
      },
    ],
    features: [
      {
        icon: '',
        content: '',
        translation: [
          {
            _lang: 'en',
            name: 'ttt',
            content: 'ttt',
          },
        ],
      },
    ],
    cancelPolicyInstructions: [
      {
        content: 'ttt',
        translation: [
          {
            _lang: 'en',
            name: 'ttt',
            content: 'ttt',
          },
        ],
      },
    ],
    enabled: true,
    enableSharingReservation: true,
    enableReservationForStore: true,
    enableReservationForMobileClients: true,
  },
  reservationsDays: [
    {
      available: true,
      day: DAYS.SATURDAY,
      disabled: true,
      full_reserved: false,
      dayInstructions: [
        {
          translation: [
            {
              _lang: 'en',
              name: 'ttt',
              content: 'ttt',
            },
          ],
        },
      ],
      workingHours: [
        {
          startAt: '',
          endAt: '',
          avgClientLifeTime: 2,
          capacityPerAverageClientTime: 1,
          disabled: true,
          capacity: 4,
        },
      ],
    },
  ],
  reservation_status: 'approved',
  inReview: true,
  start_subscription_date: new Date(),
  branchGroup: {
    _id: '6345ef95eeab41b10728d578',
    name: 'test',
    location: {
      type: '',
      coordinates: [1, 2],
    },
    translation: [
      {
        _lang: 'en',
        name: 'test',
      },
    ],
    city: '',
  },
  self_delivery: true,
  store_delivery_fee: {
    amount: 13,
    name: 'store_delivery_fee',
    translation: [
      {
        name: 'store en',
        _lang: 'en',
      },
    ],
    type: 'percentage',
  },
  fees_delivery_per_kilometer: 1,
};

export const branchStub = (): Branch => {
  return branch;
};

export const createStub = (): Branch => {
  return branch;
};

export const findAllStub = (): Branch => {
  return branch;
};

export const findOneStub = (): Branch => {
  return branch;
};

export const removeStub = (): Branch => {
  return branch;
};

export const reApplyStub = (): Branch => {
  return branch;
};

export const freezingStub = (): Branch => {
  return branch;
};

export const onlineOrOfflineStub = (): Branch => {
  return branch;
};

export const updateBranchStatusByOwnerOrMerchantEmployeeStub = (): Branch => {
  return branch;
};

export const getBranchDetailsStub = (): Branch => {
  return branch;
};

export const updateByShoppexEmployeeStub = (): Branch => {
  return branch;
};
