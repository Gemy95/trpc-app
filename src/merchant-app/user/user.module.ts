import { forwardRef, Module } from '@nestjs/common';

import { TrpcModule } from '../trpc/trpc.module';
import { UserRouter } from './user.router';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => TrpcModule)],
  providers: [UserService, UserRouter],
  exports: [UserService, UserRouter],
})
export class UserModule {}
