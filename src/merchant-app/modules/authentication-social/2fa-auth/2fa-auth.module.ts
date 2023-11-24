import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../../../libs/database/src/lib/models/common/user.schema';
import { AuthModule } from '../../auth/auth.module';
import { UserRepository } from '../../models/common/user.repository';
import { OwnerModule } from '../../owner/owner.module';
import { ShoppexEmployeeModule } from '../../shoppex-employee/shoppex-employee.module';
import { TFAController } from './2fa-auth.controller';
import { TFAService } from './2fa-auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    OwnerModule,
    ShoppexEmployeeModule,
  ],
  controllers: [TFAController],
  providers: [TFAService, UserRepository],
  exports: [TFAService, UserRepository],
})
export class TFAAuthModule {}
