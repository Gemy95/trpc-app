import { NestFactory } from '@nestjs/core';

import { MerchantAppModule } from '../../src/app.module';
import { STATUS } from '../common/constants/status.constants';
import { MerchantService } from '../merchant/merchant.service';
import { ProductGroupService } from '../product-group/product-group.service';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const productGroupService = app.get(ProductGroupService);
  const merchantService = app.get(MerchantService);
  const merchants = await merchantService.findAll({ limit: 100 });
  for (let i = 0; i < merchants.merchants.length; i++) {
    await productGroupService.create(merchants.merchants[i]._id.toString(), {
      nameArabic: 'الحجم',
      nameEnglish: 'Size',
      minimum: 1,
      maximum: 1,
      options: [
        {
          nameArabic: 'صغير',
          nameEnglish: 'Small',
          extraPrice: 0,
          serialDisplayNumber: 1,
        },
        {
          nameArabic: 'متوسط',
          nameEnglish: 'Medium',
          extraPrice: 4,
          serialDisplayNumber: 2,
        },
        {
          nameArabic: 'كبير',
          nameEnglish: 'Large',
          extraPrice: 8,
          serialDisplayNumber: 3,
        },
      ],
      required: true,
      status: STATUS.ACTIVE,
    });
  }
  process.exit();
})();
