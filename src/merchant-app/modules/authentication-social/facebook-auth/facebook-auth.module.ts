import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../../../libs/database/src/lib/models/common/user.schema';
import { UserRepository } from '../../models/common/user.repository';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookStrategy } from './facebook-auth.strategy';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService, FacebookStrategy, UserRepository],
  exports: [FacebookAuthService, FacebookStrategy, UserRepository],
})
export class FacebookAuthModule {}
