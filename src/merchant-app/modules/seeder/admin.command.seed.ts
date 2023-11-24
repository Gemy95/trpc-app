import { NestFactory } from '@nestjs/core';

import { MerchantAppModule } from '../../src/app.module';
import { CityService } from '../city/city.service';
import { Gender } from '../common/constants/users.types';
import { CountryService } from '../country/country.service';
import { DepartmentsService } from '../departments/departments.service';
import { EMPLOYEE_STATUS } from '../shoppex-employee/interface/status.enum';
import { ShoppexEmployeeService } from '../shoppex-employee/shoppex-employee.service';

(async () => {
  const app = await NestFactory.createApplicationContext(MerchantAppModule);
  const shoppexEmployeeService = app.get(ShoppexEmployeeService);
  const countryService = app.get(CountryService);
  const cityService = app.get(CityService);
  const departmentService = app.get(DepartmentsService);

  const country = await countryService.getAll({
    limit: 1,
    search: 'Saudi Arabia',
  });

  const cities = await cityService.getAllByCountryId(country['countries'][0]._id, {
    client_status: 'active',
    stores_status: 'active',
  });

  const department = await departmentService.find({
    name: 'Support',
    sortBy: 'createdAt',
    order: -1,
    limit: 1,
    page: 0,
    paginate: true,
  });

  const city = cities['cities']
    .find((city) => {
      if (city.name === 'الرياض') return city._id;
    })
    ['_id'].toString();
  const depId = department['departments']
    .find((department) => {
      if (department.name === 'الدعم الفني') return department._id;
    })
    ['_id'].toString();
  await shoppexEmployeeService.create('user', {
    name: 'Admin',
    countryCode: '+966',
    mobile: '567414834',
    email: 'admin@shoppex.net',
    password: 'Test@123',
    cityId: city,
    countryId: country['countries'][0]._id.toString(),
    uuid: 'aa4e1269-f17a-46d3-a6af-1cdb8ea1e6c0',
    departments: [depId],
    status: EMPLOYEE_STATUS.ACTIVE,
    gender: Gender.MALE,
  });
  process.exit();
})();
