// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { faker } from '@faker-js/faker';
// import { ProductService } from '../product/product.service';
// import { MerchantService } from '../merchant/merchant.service';
// import { BranchService } from '../branch/branch.service';
// import { ProductGroupService } from '../product-group/product-group.service';
// import { ProductCategoryService } from '../product-category/product-category.service';
// import { STATUS } from '../common/constants/status.constants';
// faker.locale = 'ar';

// (async () => {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const productService = app.get(ProductService);

//   const merchantService = app.get(MerchantService);

//   const branchService = app.get(BranchService);

//   const productCategoryService = app.get(ProductCategoryService);

//   const productGroupService = app.get(ProductGroupService);

//   const merchants = await merchantService.findAll({ limit: 100 });

//   for (let i = 0; i < merchants.merchants.length; i++) {
//     const groups = await productGroupService.findAll(merchants.merchants[i]._id.toString(), {});
//     const branches = await branchService.findAll(merchants.merchants[i]._id.toString());
//     const categories = await productCategoryService.getAll(merchants.merchants[i]._id.toString(), {});
//     await productService.create(
//       merchants.merchants[i].ownerId.toString(),
//       {
//         nameArabic: faker.commerce.productName(),
//         nameEnglish: faker.commerce.productName(),
//         descriptionArabic: faker.commerce.productDescription(),
//         descriptionEnglish: faker.commerce.productDescription(),
//         preparationTime: 4,
//         categoriesIds: categories['productcategories'].map(category => category._id),
//         branchesIds: branches['branches'].map(branches => branches._id),
//         price: +faker.commerce.price(10, 50, 0),
//         status: STATUS.ACTIVE,
//         calories: 300,
//         productGroupsIds: groups['productgroups'].map(group => group._id),
//         images: [
//           {
//             url: faker.image.food(640, 427),
//             titleArabic: 'صورة',
//             titleEnglish: 'image',
//             descriptionArabic: 'هذه صورة',
//             descriptionEnglish: 'this is a picture',
//             new: true,
//           },
//           {
//             url: faker.image.food(640, 427),
//             titleArabic: 'صورة',
//             titleEnglish: 'image',
//             descriptionArabic: 'هذه صورة',
//             descriptionEnglish: 'this is a picture',
//             new: true,
//           },
//         ],
//         mainImage: {
//           url: faker.image.food(640, 427),
//           titleArabic: 'صورة',
//           titleEnglish: 'image',
//           descriptionArabic: 'هذه صورة',
//           descriptionEnglish: 'this is a picture',
//           new: true,
//         },
//         quantity: 100,
//       },
//       merchants.merchants[i]._id.toString(),
//     );
//   }
//   process.exit();
// })();
