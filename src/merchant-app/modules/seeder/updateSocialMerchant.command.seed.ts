import { NestFactory } from '@nestjs/core';

import { MerchantAppModule } from '../../src/app.module';
import { MerchantRepository } from '../models/merchant/merchant.repository';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const merchantRepository = app.get(MerchantRepository);

  await merchantRepository._model.updateMany(
    {
      twitterUrl: { $eq: null },
    },
    {
      twitterUrl: {
        url: '',
        visits: 0,
      },
    },
  );

  await merchantRepository._model.updateMany(
    {
      facebookUrl: { $eq: null },
    },
    {
      facebookUrl: {
        url: '',
        visits: 0,
      },
    },
  );

  await merchantRepository._model.updateMany(
    {
      websiteUrl: { $eq: null },
    },
    {
      websiteUrl: {
        url: '',
        visits: 0,
      },
    },
  );

  await merchantRepository._model.updateMany(
    {
      snapUrl: { $eq: null },
    },
    {
      snapUrl: {
        url: '',
        visits: 0,
      },
    },
  );

  await merchantRepository._model.updateMany(
    {
      tiktokUrl: { $eq: null },
    },
    {
      tiktokUrl: {
        url: '',
        visits: 0,
      },
    },
  );

  process.exit();
})();
