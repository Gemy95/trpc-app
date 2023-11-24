// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { OwnerService } from '../owner/owner.service';
// import { faker } from '@faker-js/faker';
// import { CountryService } from '../country/country.service';
// import { CityService } from '../city/city.service';
// import { MerchantService } from '../merchant/merchant.service';
// import { CategoryService } from '../category/category.service';
// import { TagService } from '../tag/tag.service';
// faker.locale = 'ar';

// (async () => {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const ownerService = app.get(OwnerService);
//   const merchantService = app.get(MerchantService);
//   const countryService = app.get(CountryService);
//   const cityService = app.get(CityService);
//   const categoryService = app.get(CategoryService);
//   const tagService = app.get(TagService);

//   const owners = await ownerService.getForDashboard({});

//   const country = await countryService.getAll({
//     limit: 1,
//     search: 'Saudi Arabia',
//   });

//   const categories = await categoryService.getAll({
//     client_visibility: true,
//     stores_visibility: true,
//   });

//   const cities = await cityService.getAllByCountryId(country['countries'][0]._id, {
//     client_status: 'active',
//     stores_status: 'active',
//   });

//   const city = cities['cities'].find(city => {
//     if (city.name === 'الرياض') return city._id;
//   });

//   const category = categories['categories'].find(category => category.name === 'مطعم');
//   const category2 = categories['categories'].find(category => category.name === 'كافيه');
//   const category3 = categories['categories'].find(category => category.name === 'محل فواكه');

//   const tags = await tagService.getAllByCategoryId(category._id, {
//     client_visibility: true,
//     stores_visibility: true,
//   });
//   const tags2 = await tagService.getAllByCategoryId(category2._id, {
//     client_visibility: true,
//     stores_visibility: true,
//   });
//   const tags3 = await tagService.getAllByCategoryId(category3._id, {
//     client_visibility: true,
//     stores_visibility: true,
//   });

//   const divideCategoryLength = Math.floor(owners['users'].length / 3);
//   for (let i = 0; i < owners['users'].length; i++) {
//     if (divideCategoryLength < i) {
//       const user = owners['users'][i];
//       await merchantService.create(
//         {
//           nameArabic: faker.name.fullName(),
//           descriptionArabic: faker.lorem.sentence(15),
//           nameEnglish: faker.name.firstName(),
//           descriptionEnglish: faker.lorem.sentence(15),
//           commercialRegistrationNumber: faker.random.numeric(8),
//           commercialName: faker.company.name(),
//           hasDeliveryService: true,
//           uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
//           logo: faker.image.avatar(),
//           identificationImage: faker.image.food(),
//           commercialIdImage: faker.image.business(),
//           balance: 0,
//           longitude: 24.69999996,
//           latitude: 46.73333003,
//           longitudeDelta: 24.69999996,
//           latitudeDelta: 46.73333003,
//           categoriesIds: [category._id.toString()],
//           tagsIds: [tags['tags'][0]._id.toString()],
//           cityId: city['_id'].toString(),
//           mobile: faker.phone.number('567######'),
//         },
//         user,
//       );
//     }
//     if (divideCategoryLength * 2 < i) {
//       const user = owners['users'][i];

//       await merchantService.create(
//         {
//           nameArabic: faker.name.fullName(),
//           descriptionArabic: faker.lorem.sentence(15),
//           nameEnglish: faker.name.firstName(),
//           descriptionEnglish: faker.lorem.sentence(15),
//           commercialRegistrationNumber: faker.random.numeric(8),
//           commercialName: faker.company.name(),
//           hasDeliveryService: true,
//           uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
//           logo: faker.image.avatar(),
//           identificationImage: faker.image.food(),
//           commercialIdImage: faker.image.business(),
//           balance: 0,
//           longitude: 24.69999996,
//           latitude: 46.73333003,
//           longitudeDelta: 24.69999996,
//           latitudeDelta: 46.73333003,
//           categoriesIds: [category2._id.toString()],
//           tagsIds: [tags2['tags'][0]._id.toString()],
//           cityId: city['_id'].toString(),
//           mobile: faker.phone.number('567######'),
//         },
//         user,
//       );
//     } else {
//       const user = owners['users'][i];

//       await merchantService.create(
//         {
//           nameArabic: faker.name.fullName(),
//           descriptionArabic: faker.lorem.sentence(15),
//           nameEnglish: faker.name.firstName(),
//           descriptionEnglish: faker.lorem.sentence(15),
//           commercialRegistrationNumber: faker.random.numeric(8),
//           commercialName: faker.company.name(),
//           hasDeliveryService: true,
//           uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
//           logo: faker.image.avatar(),
//           identificationImage: faker.image.food(),
//           commercialIdImage: faker.image.business(),
//           balance: 0,
//           longitude: 24.69999996,
//           latitude: 46.73333003,
//           longitudeDelta: 24.69999996,
//           latitudeDelta: 46.73333003,
//           categoriesIds: [category3._id.toString()],
//           tagsIds: [tags3['tags'][1]._id.toString()],
//           cityId: city['_id'].toString(),
//           mobile: faker.phone.number('567######'),
//         },
//         user,
//       );
//     }
//   }
//   process.exit();
// })();
