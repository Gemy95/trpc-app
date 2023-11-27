import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { TrpcRouterService } from './trpc-router.service';
import { TrpcService } from './trpc.service';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  providers: [TrpcService, TrpcRouterService],
  exports: [TrpcService, TrpcRouterService],
})
export class TrpcModule {}
