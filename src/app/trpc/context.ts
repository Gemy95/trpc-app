import { ConfigService } from '@nestjs/config';
import { JwtVerifyOptions } from '@nestjs/jwt';
import { TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

export type Context = {
  user: null;
  requestId: string;
  language: string;
};

export const createContext = async ({ req, res }: CreateExpressContextOptions): Promise<Context> => {
  const requestId = uuid();
  res.setHeader('x-request-id', requestId);

  let user = null;
  const configService = new ConfigService();

  try {
    if (req?.headers?.authorization) {
      const header = req?.headers?.authorization;

      if (!header) {
        throw new TRPCError({ message: 'err_auth_token_is_missing', code: 'UNAUTHORIZED' });
      }

      const parts = header.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new TRPCError({ message: 'err_auth_token_is_invalid', code: 'UNAUTHORIZED' });
      }

      const token = parts[1];

      if (!token) {
        throw new TRPCError({ message: 'err_auth_token_is_missing', code: 'UNAUTHORIZED' });
      }

      const jwtPayload = jwt.decode(token);

      if (jwtPayload && jwtPayload?.['exp'] < Date.now() / 1000) {
        throw new TRPCError({ message: 'err_auth_token_is_expired', code: 'UNAUTHORIZED' }); // need update to use custom error
      }

      try {
        const jwtSecret = Buffer.from(
          configService.get<string>(`ACCESS_TOKEN_${jwtPayload['aud']}_PRIVATE_KEY`),
          'base64',
        ).toString('ascii');
        const accessTokenVerifyOptions: JwtVerifyOptions = {
          algorithms: ['RS256'],
          publicKey: Buffer.from(
            configService.get<string>(`ACCESS_TOKEN_${jwtPayload['aud']}_PUBLIC_KEY`),
            'base64',
          ).toString('ascii'),
          secret: Buffer.from(
            configService.get<string>(`ACCESS_TOKEN_${jwtPayload['aud']}_PRIVATE_KEY`),
            'base64',
          ).toString('ascii'),
        };
        user = await jwt.verify(token, jwtSecret, accessTokenVerifyOptions);
      } catch (error) {
        throw new TRPCError({ message: 'err_auth_token_is_invalid', code: 'UNAUTHORIZED' });
      }
    }
    const language = req.headers?.['accept-language'];
    return { user, requestId, language };
  } catch (cause) {
    console.error(cause);
    throw new TRPCError({ message: 'err_auth_token_is_invalid', code: 'UNAUTHORIZED' });
  }
};
