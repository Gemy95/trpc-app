import { NestFactory } from '@nestjs/core';

import { MerchantAppModule } from '../../src/app.module';
import { SHOPPEX_EMPLOYEE_ROLE } from '../common/roles';
import { ShoppexEmployeeRepository } from '../models';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const shoppexEmployeeRepository = app.get(ShoppexEmployeeRepository);

  await shoppexEmployeeRepository._model.updateMany(
    {},
    {
      role: SHOPPEX_EMPLOYEE_ROLE,
    },
  );

  process.exit();
})();
