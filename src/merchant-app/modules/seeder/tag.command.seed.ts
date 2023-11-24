import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { MerchantAppModule } from '../../src/app.module';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { ITag } from './interfaces/tag.interface';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const tagService = app.get(TagService);
  const tags = await fs.readFile(join(__dirname, 'data', 'tags.json'), 'utf8');
  const categoryService = app.get(CategoryService);
  const data: ITag[] = JSON.parse(tags);
  const categories = await categoryService.getAll({
    client_visibility: true,
    stores_visibility: true,
  });

  for (let i = 0; i < data.length; i++) {
    if (data[i].category === 'Resturant') {
      const category = categories['categories'].find((category) => category.name === 'مطعم');
      await tagService.create(category._id, {
        name: data[i].name_ar,
        client_visibility: true,
        stores_visibility: true,
        translation: [
          {
            _lang: 'en',
            name: data[i].name_en,
          },
        ],
        image: data[i].image,
        new: data[i].new,
      });
    }
    if (data[i].category === 'Cafe') {
      const category = categories['categories'].find((category) => category.name === 'كافيه');

      await tagService.create(category._id, {
        name: data[i].name_ar,
        client_visibility: true,
        stores_visibility: true,
        translation: [
          {
            _lang: 'en',
            name: data[i].name_en,
          },
        ],
        image: data[i].image,
        new: data[i].new,
      });
    }
    if (data[i].category === 'Fruits') {
      const category = categories['categories'].find((category) => category.name === 'محل فواكه');

      await tagService.create(category._id, {
        name: data[i].name_ar,
        client_visibility: true,
        stores_visibility: true,
        translation: [
          {
            _lang: 'en',
            name: data[i].name_en,
          },
        ],
        image: data[i].image,
        new: data[i].new,
      });
    }
  }

  process.exit();
})();
