import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { MerchantAppModule } from '../../src/app.module';
import { CategoryService } from '../category/category.service';
import { ICategory } from './interfaces/category.interface';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const categoryService = app.get(CategoryService);
  const categories = await fs.readFile(join(__dirname, 'data', 'categories.json'), 'utf8');
  const data: ICategory[] = JSON.parse(categories);

  for (let i = 0; i < data.length; i++) {
    await categoryService.create({
      name: data[i].name_ar,
      client_visibility: true,
      stores_visibility: true,
      translation: [
        {
          _lang: 'en',
          name: data[i].name_en,
        },
      ],
      status: 'active',
      image: data[i].image,
    });
  }
  process.exit();
})();
