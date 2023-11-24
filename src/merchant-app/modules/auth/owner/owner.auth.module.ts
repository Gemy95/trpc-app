import { Module } from '@nestjs/common';
import { OwnerAuthService } from '../owner/owner.auth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OwnerAuthService],
  exports: [OwnerAuthService],
})
export class OwnerAuthModule {}
