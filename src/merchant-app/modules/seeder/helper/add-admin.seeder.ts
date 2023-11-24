import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

import { Gender } from '../../common/constants/users.types';
import { ADMIN_ROLE } from '../../common/roles';
import { City, Country, Department, User } from '../../models';
import { EMPLOYEE_STATUS } from '../../shoppex-employee/interface/status.enum';
import { ICity } from '../interfaces/city.interface';
import { ICountry } from '../interfaces/country.interface';

@Injectable()
export class AddAdminSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Department.name) private readonly DepartmentModel: Model<Department>,
    @InjectModel(Country.name) private readonly CountryModel: Model<Country>,
    @InjectModel(City.name) private readonly CityModel: Model<City>,
  ) {}

  async seed(): Promise<any> {
    try {
      //   const countriesJson = await fs.readFile(join(__dirname, '..' , 'data', 'countries.json'), 'utf8');
      //   const countryData: ICountry[] = JSON.parse(countriesJson);

      const country = await this.CountryModel.create({
        name: 'المملكة العربية السعودية',
        code: '+966',
        client_status: 'active',
        stores_status: 'active',
        translation: [
          {
            _lang: 'en',
            name: 'Saudi Arabia',
          },
        ],
      });

      //   const saudiArabiaCities = await fs.readFile(join(__dirname, '..' ,'data', 'sa.cities.json'), 'utf8');
      //   const cityData: ICity[] = JSON.parse(saudiArabiaCities);

      const city = await this.CityModel.create({
        name: 'الرياض',
        country: country._id.toString(),
        client_status: 'active',
        longitude: 46.73333003,
        latitude: 24.69999996,
        longitudeDelta: 28.41463997,
        latitudeDelta: 36.41463997,
        stores_status: 'active',
        translation: [
          {
            _lang: 'en',
            name: 'Riyadh',
          },
        ],
      });

      const department = await this.DepartmentModel.create({
        nameEnglish: 'Support',
        nameArabic: 'الدعم الفني',
        uuid: 'aa4e1269-f17a-46d3-a6af-1cdb8ea1e6c0',
        oneSignalTags: [],
      });

      const SALT_ROUNDS = 10;
      const admin = await this.UserModel.create({
        name: 'Admin',
        countryCode: '+966',
        mobile: '11111111',
        email: 'test@shoppex.net',
        password: bcrypt.hashSync('Test@123', bcrypt.genSaltSync(SALT_ROUNDS)),
        cityId: city._id.toString(),
        countryId: country._id.toString(),
        uuid: 'aa4e1269-f17a-46d3-a6af-1cdb8ea1e6c0',
        departments: [department._id],
        status: EMPLOYEE_STATUS.ACTIVE,
        gender: Gender.MALE,
        role: ADMIN_ROLE,
      });

      console.log('data=', 'run.....');
    } catch (error) {
      console.log('error=', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async drop(): Promise<any> {}
}
