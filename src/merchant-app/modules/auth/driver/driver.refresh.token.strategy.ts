import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenDriverStrategy extends PassportStrategy(Strategy, 'RefreshTokenDriverStrategy') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (request: Request) => {
        const parts =
          request?.['header']?.('Authorization').split(' ') || request['handshake'].auth?.Authorization.split(' ');
        const token = parts[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: Buffer.from(configService.get<string>('REFRESH_TOKEN_DRIVER_PUBLIC_KEY'), 'base64').toString(
        'ascii',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const { iat, exp, aud, iss, sub, ...data } = payload;
    return data; // strategy set req.user= payload by default if validated
  }
}
