import { Module } from '@nestjs/common';

import { TFAAuthModule } from './2fa-auth/2fa-auth.module';
import { FacebookAuthModule } from './facebook-auth/facebook-auth.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';

@Module({
  imports: [TFAAuthModule, GoogleAuthModule, FacebookAuthModule],
})
export class SocialAuthModule {}
