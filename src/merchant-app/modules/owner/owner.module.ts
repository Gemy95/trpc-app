import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import { Owner, OwnerRepository, OwnerSchema, User, UserSchema } from '../models';
import { SmsModule } from '../sms/sms.module';
import { OwnerController } from './owner.controller';
import { OwnerProcessor } from './owner.processor';
import { OwnerService } from './owner.service';
import { forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OWNER_QUEUE } from '../common/constants/queue.constants';
import { SettingModule } from '../setting/setting.module';
import { AuthModule } from '../auth/auth.module';
import { OwnerResolver } from './owner.resolver';
@Module({
  imports: [
    SettingModule,
    BullModule.registerQueue({
      name: OWNER_QUEUE,
    }),
    SmsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [{ name: Owner.name, schema: OwnerSchema }],
      },
    ]),
    forwardRef(() => MerchantEmployeeModule),
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
      },
    ]),
    AuthModule,
  ],
  controllers: [OwnerController],
  providers: [
    OwnerService,
    MailService,
    ConfigurationService,
    CryptoService,
    OwnerRepository,
    OwnerProcessor,
    OwnerResolver,
  ],
  exports: [OwnerRepository, OwnerService],
})
export class OwnerModule {}
