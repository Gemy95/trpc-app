import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';

import { Admin, AdminSchema } from '../../../libs/database/src/lib/models/admin/admin.schema';
import { User, UserSchema } from '../../../libs/database/src/lib/models/common/user.schema';
import { Driver, DriverSchema } from '../../../libs/database/src/lib/models/driver/driver.schema';
import {
  MerchantEmployee,
  MerchantEmployeeSchema,
} from '../../../libs/database/src/lib/models/merchant-employee/merchant-employee.schema';
import { Owner, OwnerSchema } from '../../../libs/database/src/lib/models/owner/owner.schema';
import {
  ProviderEmployee,
  ProviderEmployeeSchema,
} from '../../../libs/database/src/lib/models/provider-employee/provider-employee.schema';
import {
  ProviderOwner,
  ProviderOwnerSchema,
} from '../../../libs/database/src/lib/models/provider-owner/provider-owner.schema';
import {
  ShoppexEmployee,
  ShoppexEmployeeSchema,
} from '../../../libs/database/src/lib/models/shoppex-employee/shoppex-employee.schema';
import { UpdatePermissionSeeder } from './update-permissions';

// import { Content, ContentSchema } from '../../models/content/content.schema';
// import { ConfigurationModule } from '../../config/configuration.module';
// import { ConfigurationService } from '../../config/configuration.service';
// import { Product, ProductSchema } from '../../models/product/product.schema';
// import { ProductCategory, ProductCategorySchema } from '../../models/productCategory/productCategory.schema';
// import { AddContentSeeder } from './add-content.seeder';
// import * as dotenv from 'dotenv';
// dotenv.config();
// // import 'dotenv/config';
// import { AddSettingSeeder } from './add-setting.seeder';
// import { Setting, SettingSchema } from '../../models';
// import { AddAdminSeeder } from './add-admin.seeder';
// import { ShoppexEmployee, ShoppexEmployeeSchema } from '../../models/shoppex-employee/shoppex-employee.schema';
// import { Country, CountrySchema } from '../../models/country/country.schema';
// import { City, CitySchema } from '../../models/city/city.schema';
// import { Department, DepartmentSchema } from '../../models/department/department.schema';
// import { User, UserSchema } from '../../models/common/user.schema';
// import { AddRatingScalesSeeder } from './add-rating-scales.seeder';
// import { RatingScale, RatingScaleSchema } from '../../models/rating-scale/rating-scale.schema';
// import { UpdatePermissionSeeder } from './update-permissions';

const DATABASE_URL =
  'mongodb+srv://doadmin:0CZ4vriA82971DQ3@db-mongodb-shoppex-0e3af234.mongo.ondigitalocean.com/shoppex-dev?tls=true&authSource=admin&replicaSet=db-mongodb-shoppex';

seeder({
  imports: [
    MongooseModule.forRoot(DATABASE_URL, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([
      //   { name: Content.name, schema: ContentSchema },
      //   { name: Setting.name, schema: SettingSchema },
      //   { name: Country.name, schema: CountrySchema },
      //   { name: City.name, schema: CitySchema },
      //   { name: Department.name, schema: DepartmentSchema },
      //   { name: RatingScale.name, schema: RatingScaleSchema },
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: ShoppexEmployee.name, schema: ShoppexEmployeeSchema },
      { name: Owner.name, schema: OwnerSchema },
      { name: MerchantEmployee.name, schema: MerchantEmployeeSchema },
      { name: ProviderOwner.name, schema: ProviderOwnerSchema },
      { name: ProviderEmployee.name, schema: ProviderEmployeeSchema },
      { name: Driver.name, schema: DriverSchema },
    ]),
  ],
}).run([
  // AddNumberOfSaleIntoProductSeeder,
  // AddProductsPriceRangeMerchantSeeder
  // AddProductsSerialDisplayNumberSeeder
  // AddProductsCategoriesSerialDisplayNumberSeeder
  // AddSocialUrlsMerchantSeeder
  // AddInReviewProductSeeder,
  // AddContentSeeder,
  // AddSettingSeeder,
  // AddAdminSeeder,
  // AddRatingScalesSeeder
  UpdatePermissionSeeder,
]);

// // Run seeders normally
// // npm run seed

// // Run seeders and replace existing data
// // npm run seed:refresh
