import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class RefreshTokenClientStrategy extends PassportStrategy(Strategy, 'RefreshTokenClientStrategy') {
  constructor(private configService: ConfigurationService) {
    super({
      jwtFromRequest: (request: Request) => {
        const parts =
          request?.['header']?.('Authorization').split(' ') || request['handshake'].auth?.Authorization.split(' ');
        const token = parts[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: Buffer.from(configService.auth.REFRESH_TOKEN_CLIENT_PUBLIC_KEY, 'base64').toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const { iat, exp, aud, iss, sub, ...data } = payload;
    return data; // strategy set req.user= payload by default if validated
  }
}
