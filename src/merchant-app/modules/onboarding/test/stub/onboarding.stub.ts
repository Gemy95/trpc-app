import { ForTypeEnum, OnBoarding } from '../../../models';

const onboarding: any = {
  _id: '623214d0604b6b2ab12758e5',
  for_type: ForTypeEnum.CLIENTS_DESKTOP,
  steps: [
    {
      title: 'تجربه  111114414',
      image: '',
      description: 'ان التجارب وان فشلت نجاد',
      stepNum: 2,
      translation: [
        {
          _lang: 'en',
          title: 'test for test',
          description: 'test me plz',
        },
      ],
    },
  ],
  // image: 'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/08726b36-ae30-4c03-98ab-c9878e9965cb-24.jpg',
};

export const onboardingStub = (): OnBoarding => {
  return onboarding;
};

export const createManyStub = (): OnBoarding[] => {
  return [onboarding];
};

export const getStub = (): OnBoarding[] => {
  return [onboarding];
};

export const updateManyStub = (): OnBoarding[] => {
  return [onboarding];
};

export const deleteStub = (): OnBoarding => {
  return onboarding;
};
