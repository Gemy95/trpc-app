import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { AttachmentsModule } from '../attachments/attachments.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import {
  ShoppexEmployee,
  ShoppexEmployeeRepository,
  ShoppexEmployeeSchema,
  User,
  UserRepository,
  UserSchema,
} from '../models';
import { Admin, AdminSchema } from '../models';
import { AdminRepository } from '../models/admin/admin.repository';
import { SmsModule } from '../sms/sms.module';
import { ShoppexEmployeeController } from './shoppex-employee.controller';
import { ShoppexEmployeeResolver } from './shoppex-employee.resolver';
import { ShoppexEmployeeService } from './shoppex-employee.service';

@Module({
  imports: [
    SmsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: ShoppexEmployee.name, schema: ShoppexEmployeeSchema },
          { name: Admin.name, schema: AdminSchema },
        ],
      },
    ]),
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
      },
    ]),
    AuthModule,
    AttachmentsModule,
  ],
  controllers: [ShoppexEmployeeController],
  providers: [
    ShoppexEmployeeService,
    MailService,
    ConfigurationService,
    CryptoService,
    ShoppexEmployeeRepository,
    ShoppexEmployeeResolver,
    AdminRepository,
  ],
  exports: [ShoppexEmployeeService],
})
export class ShoppexEmployeeModule {}
