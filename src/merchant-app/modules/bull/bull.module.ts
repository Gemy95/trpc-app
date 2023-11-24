import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../config/configuration.module';
import { ConfigurationService } from '../config/configuration.service';
import { ConfigModule } from '@nestjs/config';
import { QueuesManagerService } from './generate-queue';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => ({
        redis: {
          // host: configService.redis.REDIS_HOST,
          host: process.env.REDIS_HOST,
          port: +configService.redis.REDIS_PORT,
        },
      }),
      inject: [ConfigurationService],
    }),
  ],
  providers: [ConfigurationService, QueuesManagerService],
  exports: [QueuesManagerService],
})
export class BullModuleConfig {}
