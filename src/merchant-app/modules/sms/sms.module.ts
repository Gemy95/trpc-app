import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SlackModule } from '../slack/slack.module';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [
    SlackModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigurationModule,
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
