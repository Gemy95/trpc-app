import { RatingScale } from '../../../models';

const ratingScale = {
  _id: '631e43c04f007559e55fb046',
  name: 'غير راضٍ للغاية',
  translation: [{ _lang: 'en', name: 'highly dissatisfied' }],
  image:
    'https://shopex-uploads.s3.amazonaws.com/dev/e152f516-d1f3-4686-985d-468832635ddb-sentiment-dissatisfied_118688.png',
  level: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const ratingScaleStub = (): RatingScale => {
  return ratingScale;
};

export const createStub = (): RatingScale => {
  return ratingScale;
};

export const findAllStub = (): RatingScale => {
  return ratingScale;
};

export const findOneStub = (): RatingScale => {
  return ratingScale;
};

export const updateStub = (): RatingScale => {
  return ratingScale;
};
