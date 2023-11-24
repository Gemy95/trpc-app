import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { CryptoService } from '../../crypto/crypto.service';
import { IS_PUBLIC_KEY } from '../decorators/public-routes.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly cryptoService: CryptoService) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const header = request?.header?.('Authorization') || request?.handshake?.auth?.Authorization;

    const requestType = request?.handshake?.query?.transport == 'websocket' ? 'SOCKET' : 'HTTP';

    if (!header && requestType == 'HTTP') {
      throw new HttpException(ERROR_CODES.err_auth_token_is_missing, HttpStatus.UNAUTHORIZED);
    } else if (!header && requestType == 'SOCKET') {
      throw new WsException(ERROR_CODES.err_auth_token_is_missing);
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || (parts[0] !== 'Bearer' && requestType == 'HTTP')) {
      throw new HttpException(ERROR_CODES.err_auth_token_is_invalid, HttpStatus.UNAUTHORIZED);
    } else if (parts.length !== 2 || (parts[0] !== 'Bearer' && requestType == 'SOCKET')) {
      throw new WsException(ERROR_CODES.err_auth_token_is_invalid);
    }

    const token = parts[1];

    if (!token && requestType == 'HTTP') {
      throw new UnauthorizedException(ERROR_CODES.err_auth_token_is_missing);
    } else if (!token && requestType == 'SOCKET') {
      throw new WsException(ERROR_CODES.err_auth_token_is_missing);
    }

    try {
      const payload = await this.cryptoService.verifyJwtToken(token);
      request.user = payload;
    } catch (error) {
      if (requestType == 'SOCKET') throw new WsException(ERROR_CODES.err_auth_token_is_invalid);
      throw new UnauthorizedException(ERROR_CODES.err_auth_token_is_invalid);
    }

    return true;
  }
}
