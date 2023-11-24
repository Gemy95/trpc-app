import { Module } from '@nestjs/common';
import { AdminAuthService } from '../admin/admin.auth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AdminAuthService],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
