import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { MerchantAppModule } from '../../src/app.module';
import { CountryService } from '../country/country.service';
import { ICountry } from './interfaces/country.interface';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const countryService = app.get(CountryService);
  const countriesJson = await fs.readFile(join(__dirname, 'data', 'countries.json'), 'utf8');

  const data: ICountry[] = JSON.parse(countriesJson);

  for (let i = 0; i < data.length; i++) {
    await countryService.create({
      name: data[i].name_ar,
      code: data[i].code,
      client_status: 'active',
      stores_status: 'active',
      translation: [
        {
          _lang: 'en',
          name: data[i].name_en,
        },
      ],
    });
  }

  process.exit();
})();
