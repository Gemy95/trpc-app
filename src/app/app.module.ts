import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import '@sentry/tracing';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // seconds
      limit: 60, // number of trying
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
