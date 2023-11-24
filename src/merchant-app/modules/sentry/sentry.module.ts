import { DynamicModule, FactoryProvider, Inject, Module, ModuleMetadata } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryService } from './sentry.service';
import { SentryInterceptor } from '../interceptors/sentry.interceptor';
import { ConfigurationService } from '../config/configuration.service';

export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';
export interface SentryOptions {
  dsn: string;
  tracesSampleRate: number;
  debug: boolean;
}

export type SentryAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<SentryOptions>, 'useFactory' | 'inject'>;

@Module({
  providers: [ConfigurationService, SentryService],
})
export class SentryModule {
  constructor(@Inject(SENTRY_OPTIONS) private data: SentryOptions) {}

  static forRoot(options: Sentry.NodeOptions) {
    // initialization of Sentry, this is where Sentry will create a Hub
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        SentryService,
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
      ],
      exports: [SentryService],
    };
  }

  static forRootAsync(options: SentryAsyncOptions): DynamicModule {
    return {
      module: SentryModule,
      imports: options.imports,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        SentryService,
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
      ],
      exports: [SentryService],
    };
  }
}
