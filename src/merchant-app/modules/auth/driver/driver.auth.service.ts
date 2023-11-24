import { Injectable } from '@nestjs/common';
import { AuthUserType } from '../shared/constants/auth.types.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class DriverAuthService {
  constructor(private authService: AuthService) {}

  generateTokens(
    payload: any, // need update IClient | IAdmin etc...
  ) {
    return this.authService.generateTokens(AuthUserType.DRIVER, payload);
  }

  refreshTokens(
    payload: any, // need update IClient | IAdmin etc...
  ) {
    return this.authService.generateTokens(AuthUserType.DRIVER, payload);
  }
}
