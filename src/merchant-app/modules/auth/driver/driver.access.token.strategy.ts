import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenDriverStrategy extends PassportStrategy(Strategy, 'AccessTokenDriverStrategy') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (request: Request) => {
        const parts =
          request?.['header']?.('Authorization').split(' ') || request['handshake'].auth?.Authorization.split(' ');
        const token = parts[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: Buffer.from(configService.get<string>('ACCESS_TOKEN_DRIVER_PUBLIC_KEY'), 'base64').toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload; // strategy set req.user= payload by default if validated
  }
}
