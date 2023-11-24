import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthUserType } from '../shared/constants/auth.types.enum';

@Injectable()
export class AdminAuthService {
  constructor(private authService: AuthService) {}

  generateTokens(
    payload: any, // need update IClient | IAdmin etc...
  ) {
    return this.authService.generateTokens(AuthUserType.ADMIN, payload);
  }

  refreshTokens(
    payload: any, // need update IClient | IAdmin etc...
  ) {
    return this.authService.generateTokens(AuthUserType.ADMIN, payload);
  }
}
