import { Module } from '@nestjs/common';
import { ClientAuthService } from '../client/client.auth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ClientAuthService],
  exports: [ClientAuthService],
})
export class ClientAuthModule {}
