import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema, UserRepository } from '../models';
import { CryptoService } from '../crypto/crypto.service';
import { SmsModule } from '../sms/sms.module';
import { MailService } from '../mail/mail.service';
import { ConfigurationService } from '../config/configuration.service';
import { RefreshTokenAdminStrategy } from './admin/admin.refresh.token.strategy';
import { AccessTokenAdminStrategy } from './admin/admin.access.token.strategy';
import { RefreshTokenOwnerStrategy } from './owner/owner.refresh.token.strategy';
import { AccessTokenClientStrategy } from './client/client.access.token.strategy';
import { AccessTokenOwnerStrategy } from './owner/owner.access.token.strategy';
import { RefreshTokenClientStrategy } from './client/client.refresh.token.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenDriverStrategy } from './driver/driver.access.token.strategy';
import { RefreshTokenDriverStrategy } from './driver/driver.refresh.token.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SmsModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  // controllers: [AuthController,],
  providers: [
    AuthService,
    UserRepository,
    CryptoService,
    MailService,
    ConfigurationService,
    JwtService,
    AuthService,
    AccessTokenAdminStrategy,
    RefreshTokenAdminStrategy,
    AccessTokenOwnerStrategy,
    RefreshTokenOwnerStrategy,
    AccessTokenClientStrategy,
    RefreshTokenClientStrategy,
    AccessTokenDriverStrategy,
    RefreshTokenDriverStrategy,
  ],
  exports: [AuthService, UserRepository, JwtService],
})
export class AuthModule {}
