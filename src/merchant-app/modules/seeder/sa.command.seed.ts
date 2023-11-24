import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { MerchantAppModule } from '../../src/app.module';
import { CityService } from '../city/city.service';
import { CountryService } from '../country/country.service';
import { ICity } from './interfaces/city.interface';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const cityService = app.get(CityService);
  const countryService = app.get(CountryService);
  const saudiArabiaCities = await fs.readFile(join(__dirname, 'data', 'sa.cities.json'), 'utf8');
  const data: ICity[] = JSON.parse(saudiArabiaCities);

  const SACountryId = await countryService.getAll({
    limit: 1,
    search: 'Saudi Arabia',
  });

  for (let i = 0; i < data.length; i++) {
    await cityService.create({
      name: data[i].name_ar,
      country: SACountryId['countries'][0]._id,
      client_status: 'active',
      longitude: data[i].center[0],
      latitude: data[i].center[1],
      longitudeDelta: data[i].center[0],
      latitudeDelta: data[i].center[1],
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
