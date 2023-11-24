import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../../../libs/database/src/lib/models/common/user.schema';
import { UserRepository } from '../../models/common/user.repository';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { GoogleStrategy } from './google-auth.strategy';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy, UserRepository],
  exports: [GoogleAuthService, GoogleStrategy, UserRepository],
})
export class GoogleAuthModule {}
