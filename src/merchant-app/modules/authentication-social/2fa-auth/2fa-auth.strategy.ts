import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class TFAStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(/*private readonly userService: UsersService*/) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    // const user = await this.userService.findOne(payload.email);
    // if (!user.isTwoFactorAuthenticationEnabled) {
    //   return user;
    // }
    // if (payload.isTwoFactorAuthenticated) {
    //   return user;
    // }
  }
}
