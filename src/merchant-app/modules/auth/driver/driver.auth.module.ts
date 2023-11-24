import { Module } from '@nestjs/common';

import { DriverAuthService } from './driver.auth.service';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  providers: [DriverAuthService],
  exports: [DriverAuthService],
})
export class DriverAuthModule {}
