import { Rating } from '../../../models';

const rating: Rating = {
  _id: '2db76c54-fa3f-4e81-8bd0-5db1f9248ac3',
  extraNote: '',
  comment: 'Perfect Service',
  rating: '3ea97faa-8a95-487d-af99-4dab3f4c6b0f',
  client: 'd7bc9710-da3a-4d8c-9304-7419f83a90c0',
  order: '634ac5f3-cffa-40cd-94b0-d7df04ee76fa',
  branch: '430ed0e7-f525-41be-9451-26927acb5a7a',
  merchant: 'f09d60c7-7787-4441-91fd-b081160ae024',
  is_public: true,
};

export const ratingStub = (): Rating => {
  return rating;
};

export const getLatestOrderStub = () => {
  return { success: true, rated: true };
};

export const booleanStub = () => {
  return { success: true };
};

export const ratingsStubValue = (): {
  modelId: string;
  avgOrdersRating: number;
  rating: Rating[];
} => {
  return {
    modelId: '2db76c54-fa3f-4e81-8bd0-5db1f9248ac3',
    avgOrdersRating: 5,
    rating: [rating],
  };
};

export const dashboardRatingStub = (): {
  success: boolean;
  ratings?: Rating[];
  levelOneCount?: number;
  levelTwoCount?: number;
  levelThreeCount?: number;
  levelFourCount?: number;
  levelFiveCount?: number;
  totalRatings?: number;
  page?: number;
  pages?: number;
  length?: number;
} => {
  return {
    success: true,
    ratings: [rating],
    levelOneCount: 1,
    levelTwoCount: 2,
    levelThreeCount: 3,
    levelFourCount: 4,
    levelFiveCount: 5,
    totalRatings: 20,
    page: 1,
    pages: 2,
    length: 3,
  };
};
