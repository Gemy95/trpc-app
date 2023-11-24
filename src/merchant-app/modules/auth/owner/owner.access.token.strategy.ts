import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class AccessTokenOwnerStrategy extends PassportStrategy(Strategy, 'AccessTokenOwnerStrategy') {
  constructor(private configService: ConfigurationService) {
    super({
      jwtFromRequest: (request: Request) => {
        const parts =
          request?.['header']?.('Authorization').split(' ') || request['handshake'].auth?.Authorization.split(' ');
        const token = parts[1];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: Buffer.from(configService.auth.ACCESS_TOKEN_OWNER_PUBLIC_KEY, 'base64').toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload; // strategy set req.user= payload by default if validated
  }
}
