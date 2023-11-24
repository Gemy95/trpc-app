// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { BranchService } from '../branch/branch.service';
// import { CityService } from '../city/city.service';
// import { CountryService } from '../country/country.service';
// import { faker } from '@faker-js/faker';
// import { MerchantService } from '../merchant/merchant.service';
// faker.locale = 'ar';

// (async () => {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const branchService = app.get(BranchService);
//   const merchantService = app.get(MerchantService);
//   const countryService = app.get(CountryService);
//   const cityService = app.get(CityService);
//   const country = await countryService.getAll({
//     limit: 1,
//     search: 'Saudi Arabia',
//   });
//   const merchants = await merchantService.findAll({});
//   const cities = await cityService.getAllByCountryId(country['countries'][0]._id, {
//     client_status: 'active',
//     stores_status: 'active',
//   });
//   const city = cities['cities']
//     .find(city => {
//       if (city.name === 'الرياض') return city._id;
//     })
//     ['_id'].toString();

//   // for (let i = 0; i < 3; i++) {
//   //   for (let j = 0; j < merchants.merchants.length; j++) {
//   //     await branchService.create(merchants.merchants[j]['owner'], merchants.merchants[j]._id.toString(), {
//   //       nameArabic: faker.address.street(),
//   //       nameEnglish: faker.address.street(),
//   //       mobile: faker.phone.number('567######'),
//   //       cityId: city,
//   //       longitude: +faker.address.longitude(26, 23, 7),
//   //       latitude: +faker.address.latitude(47, 46, 7),
//   //       longitudeDelta: +faker.address.longitude(26, 23, 7),
//   //       latitudeDelta: +faker.address.latitude(47, 46, 7),
//   //     });
//   //   }
//   // }

//   process.exit();
// })();
