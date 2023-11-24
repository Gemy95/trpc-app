import { NestFactory } from '@nestjs/core';

import { MerchantAppModule } from '../../src/app.module';
import { ProductRepository } from '../models';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const productRepository = app.get(ProductRepository);

  await productRepository._model.updateMany(
    {
      // Query
    },
    [
      // Aggregation pipeline
      { $set: { remainingQuantity: '$quantity' } },
    ],
    {
      // Options
      multi: true, // false when a single doc has to be updated
    },
  );

  process.exit();
})();
