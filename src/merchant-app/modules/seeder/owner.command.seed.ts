// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { OwnerService } from '../owner/owner.service';
// import { faker } from '@faker-js/faker';
// import { CountryService } from '../country/country.service';
// import { CityService } from '../city/city.service';

// (async () => {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const ownerService = app.get(OwnerService);
//   const countryService = app.get(CountryService);
//   const cityService = app.get(CityService);

//   const country = await countryService.getAll({
//     limit: 1,
//     search: 'Saudi Arabia',
//   });
//   const cities = await cityService.getAllByCountryId(country['countries'][0]._id, {
//     client_status: 'active',
//     stores_status: 'active',
//   });

//   for (let i = 0; i < 50; i++) {
//     const city = cities['cities']
//       .find(city => {
//         if (city.name === 'الرياض') return city._id;
//       })
//       ['_id'].toString();
//     await ownerService.create({
//       name: `${faker.name.firstName()} ${faker.name.lastName()}`,
//       countryCode: '+966',
//       mobile: `${faker.phone.number('567######')}`,
//       email: `${faker.internet.email(faker.name.firstName())}`,
//       password: 'Test@123',
//       cityId: city,
//       countryId: country['countries'][0]._id.toString(),
//       uuid: 'd42a8273-a4fe-4eb2-b4ee-c1fc57eb9865',
//       dateOfBirth: faker.date.birthdate({ min: 21 }),
//     });
//   }
//   process.exit();
// })();
