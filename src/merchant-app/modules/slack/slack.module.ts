import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { ConfigurationService } from '../config/configuration.service';

@Module({
  providers: [SlackService, ConfigurationService],
  exports: [SlackService],
})
export class SlackModule {}
