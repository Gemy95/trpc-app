import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get mongo(): string {
    return this.configService.get<string>('mongo.url');
  }

  get common(): { pageSize: number; maxPageSize: number } {
    return this.configService.get<{ pageSize: number; maxPageSize: number }>('common');
  }

  get app(): { name: string; version: number } {
    return this.configService.get<{ name: string; version: number }>('app');
  }

  get auth(): {
    key: string;
    expiry: string;
    ACCESS_TOKEN_ADMIN_PUBLIC_KEY: string;
    ACCESS_TOKEN_ADMIN_PRIVATE_KEY: string;
    ACCESS_TOKEN_ADMIN_EXPIRY_IN: string;

    REFRESH_TOKEN_ADMIN_PUBLIC_KEY: string;
    REFRESH_TOKEN_ADMIN_PRIVATE_KEY: string;
    REFRESH_TOKEN_ADMIN_EXPIRY_IN: string;

    ACCESS_TOKEN_CLIENT_PUBLIC_KEY: string;
    ACCESS_TOKEN_CLIENT_PRIVATE_KEY: string;
    ACCESS_TOKEN_CLIENT_EXPIRY_IN: string;

    REFRESH_TOKEN_CLIENT_PUBLIC_KEY: string;
    REFRESH_TOKEN_CLIENT_PRIVATE_KEY: string;
    REFRESH_TOKEN_CLIENT_EXPIRY_IN: string;

    ACCESS_TOKEN_OWNER_PUBLIC_KEY: string;
    ACCESS_TOKEN_OWNER_PRIVATE_KEY: string;
    ACCESS_TOKEN_OWNER_EXPIRY_IN: string;

    REFRESH_TOKEN_OWNER_PUBLIC_KEY: string;
    REFRESH_TOKEN_OWNER_PRIVATE_KEY: string;
    REFRESH_TOKEN_OWNER_EXPIRY_IN: string;
  } {
    return this.configService.get<{
      key: string;
      expiry: string;
      ACCESS_TOKEN_ADMIN_PUBLIC_KEY: string;
      ACCESS_TOKEN_ADMIN_PRIVATE_KEY: string;
      ACCESS_TOKEN_ADMIN_EXPIRY_IN: string;

      REFRESH_TOKEN_ADMIN_PUBLIC_KEY: string;
      REFRESH_TOKEN_ADMIN_PRIVATE_KEY: string;
      REFRESH_TOKEN_ADMIN_EXPIRY_IN: string;

      ACCESS_TOKEN_CLIENT_PUBLIC_KEY: string;
      ACCESS_TOKEN_CLIENT_PRIVATE_KEY: string;
      ACCESS_TOKEN_CLIENT_EXPIRY_IN: string;

      REFRESH_TOKEN_CLIENT_PUBLIC_KEY: string;
      REFRESH_TOKEN_CLIENT_PRIVATE_KEY: string;
      REFRESH_TOKEN_CLIENT_EXPIRY_IN: string;

      ACCESS_TOKEN_OWNER_PUBLIC_KEY: string;
      ACCESS_TOKEN_OWNER_PRIVATE_KEY: string;
      ACCESS_TOKEN_OWNER_EXPIRY_IN: string;

      REFRESH_TOKEN_OWNER_PUBLIC_KEY: string;
      REFRESH_TOKEN_OWNER_PRIVATE_KEY: string;
      REFRESH_TOKEN_OWNER_EXPIRY_IN: string;
    }>('authentication');
  }

  get port(): number {
    return this.configService.get<number>('port');
  }

  get env(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('env') === 'development';
  }

  get storage(): {
    accessKey: string;
    secretKey: string;
    baseUrl: string;
    bucket: string;
    region: string;
    folder: string;
  } {
    return this.configService.get<{
      accessKey: string;
      secretKey: string;
      baseUrl: string;
      bucket: string;
      region: string;
      folder: string;
    }>('storage');
  }

  get oneSignal(): {
    CLIENT_APP_ID: string;
    CLIENT_REST_API_KEY: string;
    SHOPPEX_EMPLOYEE_APP_ID: string;
    SHOPPEX_EMPLOYEE_API_KEY: string;
    SHOPPEX_MERCHANT_APP_ID: string;
    SHOPPEX_MERCHANT_API_KEY: string;
  } {
    return this.configService.get<{
      CLIENT_APP_ID: string;
      CLIENT_REST_API_KEY: string;
      SHOPPEX_EMPLOYEE_APP_ID: string;
      SHOPPEX_EMPLOYEE_API_KEY: string;
      SHOPPEX_MERCHANT_APP_ID: string;
      SHOPPEX_MERCHANT_API_KEY: string;
    }>('onesignal');
  }

  get shoppexWalletId() {
    return this.configService.get<string>('SHOPPEX_WALLET_ID');
  }

  get redis() {
    return this.configService.get<{
      REDIS_HOST: string;
      REDIS_URL: string;
      REDIS_PORT: number;
    }>('redis');
  }

  get sentry() {
    return this.configService.get<{
      DSN: string;
      tracesSampleRate: number;
      debug: boolean;
    }>('sentry');
  }

  get paytabs() {
    return this.configService.get<{
      profileId: string;
      serverKey: string;
      region: string;
    }>('paytabs');
  }

  get merchantWebsiteUrl(): string {
    return this.configService.get<string>('merchantWebsiteUrl');
  }
}
