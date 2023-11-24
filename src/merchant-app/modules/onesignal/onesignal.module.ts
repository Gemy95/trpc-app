import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../config/configuration.module';
import { adminOneSignalProvider, clientOneSignalProvider, merchantOneSignalProvider } from './onesignal.provider';

@Module({
  imports: [ConfigurationModule],
  providers: [clientOneSignalProvider, adminOneSignalProvider, merchantOneSignalProvider],
  exports: [clientOneSignalProvider, adminOneSignalProvider, merchantOneSignalProvider],
})
export class OneSignalModule {}
