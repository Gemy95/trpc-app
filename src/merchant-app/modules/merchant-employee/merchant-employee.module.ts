import { Module } from '@nestjs/common';
import { MerchantEmployeeService } from './merchant-employee.service';
import { MerchantEmployeeController } from './merchant-employee.controller';
import {
  MerchantEmployee,
  MerchantEmployeeSchema,
  MerchantEmployeeRepository,
  User,
  UserSchema,
  MerchantRepository,
  Merchant,
  MerchantSchema,
} from '../models';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from '../crypto/crypto.service';
import { ConfigurationService } from '../config/configuration.service';
import { MailService } from '../mail/mail.service';
import { SmsModule } from '../sms/sms.module';
import { OwnerModule } from '../owner/owner.module';
import { forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { MerchantEmployeeResolver } from './merchant-employee.resolver';
import { BranchModule } from '../branch/branch.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    AuthModule,
    SmsModule,
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [{ name: MerchantEmployee.name, schema: MerchantEmployeeSchema }],
      },
    ]),
    forwardRef(() => OwnerModule),
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
      },
    ]),
    forwardRef(() => BranchModule),
    forwardRef(() => UserModule),
  ],
  controllers: [MerchantEmployeeController],
  providers: [
    MerchantEmployeeService,
    MailService,
    ConfigurationService,
    CryptoService,
    MerchantEmployeeRepository,
    MerchantRepository,
    MerchantEmployeeResolver,
  ],
  exports: [MerchantEmployeeService, MerchantRepository, MerchantEmployeeRepository],
})
export class MerchantEmployeeModule {}
