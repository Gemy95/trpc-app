import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { MerchantAppModule } from '../../src/app.module';
import { CategoryService } from '../category/category.service';
import { MerchantService } from '../merchant/merchant.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { IProductCategory } from './interfaces/product-category.interface';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const productCategoryService = app.get(ProductCategoryService);
  const categoryService = app.get(CategoryService);
  const merchantService = app.get(MerchantService);
  const categories = await categoryService.getAll({
    client_visibility: true,
    stores_visibility: true,
  });
  const resturantCategorymerchants = await merchantService.findAll({
    categories: [`${categories['categories'].find((category) => category.name === 'مطعم')['_id'].toString()}`],
  });
  const cafeCategorymerchants = await merchantService.findAll({
    categories: [`${categories['categories'].find((category) => category.name === 'كافيه')['_id'].toString()}`],
  });
  const fruitCategorymerchants = await merchantService.findAll({
    categories: [`${categories['categories'].find((category) => category.name === 'محل فواكه')['_id'].toString()}`],
  });

  const productCategories = await fs.readFile(join(__dirname, 'data', 'product-categories.json'), 'utf8');
  const data: IProductCategory[] = JSON.parse(productCategories);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < resturantCategorymerchants['merchants'].length; j++) {
      await productCategoryService.create(resturantCategorymerchants['merchants'][j]._id.toString(), {
        nameArabic: data[i].name_ar,
        nameEnglish: data[i].name_en,
        status: data[i].status,
        image: data[i].image,
      });
    }
  }
  for (let i = 4; i < 6; i++) {
    for (let j = 0; j < cafeCategorymerchants['merchants'].length; j++) {
      await productCategoryService.create(cafeCategorymerchants['merchants'][j]._id.toString(), {
        nameArabic: data[i].name_ar,
        nameEnglish: data[i].name_en,
        status: data[i].status,
        image: data[i].image,
      });
    }
  }
  for (let i = 7; i < 8; i++) {
    for (let j = 0; j < fruitCategorymerchants['merchants'].length; j++) {
      await productCategoryService.create(fruitCategorymerchants['merchants'][j]._id.toString(), {
        nameArabic: data[i].name_ar,
        nameEnglish: data[i].name_en,
        status: data[i].status,
        image: data[i].image,
      });
    }
  }
  process.exit();
})();
