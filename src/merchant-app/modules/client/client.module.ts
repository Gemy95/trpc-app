import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrpcModule } from '../../trpc/trpc.module';
import { AuthModule } from '../auth/auth.module';
import { BranchModule } from '../branch/branch.module';
import { CLIENT_QUEUE } from '../common/constants/queue.constants';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { ClientNotificationProcessor } from '../dashboard/client-notification.process';
import { MailService } from '../mail/mail.service';
import {
  Address,
  AddressRepository,
  AddressSchema,
  Client,
  ClientRepository,
  ClientSchema,
  User,
  UserSchema,
} from '../models';
import { NotificationModule } from '../notification/notification.module';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { SettingModule } from '../setting/setting.module';
import { SlackModule } from '../slack/slack.module';
import { SmsModule } from '../sms/sms.module';
import { ClientGateWay } from '../socket/client.socket.gateway';
import { ChangeEmailController } from './client-change-email.controller';
import { ChangeMobileController } from './client-change-mobile.controller';
import { ClientController } from './client.controller';
import { ClientResolver } from './client.resolver';
import { ClientRouter } from './client.router';
import { ClientService } from './client.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CLIENT_QUEUE,
    }),
    OneSignalModule,
    NotificationModule,
    SmsModule,
    SettingModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [{ name: Client.name, schema: ClientSchema }],
      },
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
    AuthModule,
    SlackModule,
    forwardRef(() => BranchModule),
    forwardRef(() => TrpcModule),
  ],
  // controllers: [ClientController, ChangeEmailController, ChangeMobileController],
  providers: [
    ClientService,
    MailService,
    ConfigurationService,
    CryptoService,
    ClientRepository,
    AddressRepository,
    ClientNotificationProcessor,
    ClientGateWay,
    // ClientResolver,
    ClientRouter,
  ],
  exports: [ClientService, ClientRepository, ClientRouter],
})
export class ClientModule {}
