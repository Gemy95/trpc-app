import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Sentry from '@sentry/node';
// import { join } from "mongodb";
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { AuthModule } from './modules/auth/auth.module';
import { DriverAuthModule } from './modules/auth/driver/driver.auth.module';
import { AccessTokenAuthGuard } from './modules/auth/shared/guards/access.token.guard';
import { CustomThrottlerGuard } from './modules/auth/shared/guards/throttle.guard';
import { SocialAuthModule } from './modules/authentication-social/social-auth.module';
import { BankModule } from './modules/bank/bank.module';
import { BranchGroupModule } from './modules/branch-group/branch-group.module';
import { BranchModule } from './modules/branch/branch.module';
import { BullModuleConfig } from './modules/bull/bull.module';
import { BranchCategoryModule } from './modules/category-branch/branch-category.module';
import { CategoryModule } from './modules/category/category.module';
import { CityModule } from './modules/city/city.module';
import { ClientModule } from './modules/client/client.module';
import { ConfigurationModule } from './modules/config/configuration.module';
import { ConfigurationService } from './modules/config/configuration.service';
import { ContentModule } from './modules/content/content.module';
import { CountryModule } from './modules/country/country.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CronsService } from './modules/crons/cron.service';
import { CryptoService } from './modules/crypto/crypto.service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { DiscountModule } from './modules/discount/discount.module';
import { FavoriteModule } from './modules/favourite/favorite.module';
import { MailModule } from './modules/mail/mail.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { MenuTemplateProductGroupModule } from './modules/menu-template-product-group/menu-template-product-group.module';
import { MenuTemplateProductModule } from './modules/menu-template-product/menu-template-product.module';
import { MenuTemplateModule } from './modules/menu-template/menu-template.module';
import { MenuUploadModule } from './modules/menu-upload/menu-upload.module';
import { MenuModule } from './modules/menu/menu.module';
import { MerchantEmployeeModule } from './modules/merchant-employee/merchant-employee.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { OneSignalModule } from './modules/onesignal/onesignal.module';
import { OrderModule } from './modules/order/order.module';
import { OwnerModule } from './modules/owner/owner.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { ProductModule } from './modules/product/product.module';
import { RatingScaleModule } from './modules/rating-scale/rating-scale.module';
import { RatingModule } from './modules/rating/rating.module';
import { RedisModuleConfig } from './modules/redis/redis.module';
import { RequestsModule } from './modules/requests/requests.module';
import { ReservationModule } from './modules/reservation/reservation.module';
// import { SearchModule } from './scalars/objectId-custom.scalar';
// import { SearchModule } from './scalars/upload.scalar';
import { SearchModule } from './modules/search/search.module';
import { SentryModule } from './modules/sentry/sentry.module';
import { ShoppexEmployeeModule } from './modules/shoppex-employee/shoppex-employee.module';
import { SmsModule } from './modules/sms/sms.module';
import { SocketModule } from './modules/socket/socket.module';
import { TableModule } from './modules/table/table.module';
import { TagModule } from './modules/tag/tag.module';
import { TicketsTagReasonModule } from './modules/tickets-tag-reason/tickets-tag-reason.module';
import { TicketsTagModule } from './modules/tickets-tag/tickets-tag.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UpdateRequestModule } from './modules/update-request/update-request.module';
import { StorageService } from './storage.service';
import { UserModule } from './user/user.module';

import '@sentry/tracing';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // seconds
      limit: 60, // number of trying
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async () => ({
        // uri: configService.mongo,
        uri: process.env.MONGO_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        /** ADDING THE FOLLOWING, SO MONGOOSE SHOULD CHECK FOR UNIQUENESS */
        // useCreateIndex: true,
        // autoIndex: true,
      }),
      inject: [ConfigurationService],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    BullModuleConfig,
    RedisModuleConfig,
    ConfigurationModule,
    MailModule,
    SmsModule,
    AuthModule,
    OwnerModule,
    ClientModule,
    ShoppexEmployeeModule,
    DriverAuthModule,
    UpdateRequestModule,
    MerchantModule,
    MerchantEmployeeModule,
    AttachmentsModule,
    BranchModule,
    BranchCategoryModule,
    OrderModule,
    CountryModule,
    CityModule,
    ProductGroupModule,
    ProductModule,
    ProductCategoryModule,
    TableModule,
    ReservationModule,
    CategoryModule,
    TagModule,
    DepartmentsModule,
    OnboardingModule,
    OneSignalModule,
    DashboardModule,
    SearchModule,
    TransactionsModule,
    MenuModule,
    RequestsModule,
    SocketModule,
    MarketplaceModule,
    ContentModule,
    DiscountModule,
    TicketsModule,
    TicketsTagModule,
    TicketsTagReasonModule,
    RatingScaleModule,
    RatingModule,
    NotificationModule,
    // SentryModule.forRoot({
    //   dsn: process.env.SENTRY_DSN,
    //   tracesSampleRate: 1.0,
    //   debug: true,
    // }),
    SentryModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => ({
        dsn: configService.sentry.DSN,
        tracesSampleRate: configService.sentry.tracesSampleRate,
        debug: configService.sentry.debug,
        environment: configService.env,
      }),
      inject: [ConfigurationService],
    }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   imports: [ConfigurationModule],
    //   inject: [ConfigurationService],
    //   driver: ApolloDriver,
    //   useFactory: async (configService: ConfigurationService) => ({
    //     path: '/graphql',
    //     useGlobalPrefix: true,
    //     // server: {
    //     //   cors: true,
    //     //   useGlobalPrefix: true,
    //     //   path: 'api/graphql',
    //     // },
    //     typePaths: [process.cwd()+'/src/main-app/**/*.graphql'],
    //     definitions: {
    //       path: join(process.cwd(), '/src/main-app/graphql.ts'),
    //       outputAs: 'class',
    //     },
    //     cors: {
    //       origin: true,
    //       credentials: true,
    //       methods: ['GET', 'POST', 'OPTIONS'],
    //     },
    //     uploads: {
    //       maxFileSize: 10000000,  // 10 MB
    //       maxFiles: 5,
    //     },
    //     context: ({ req, res }) => ({ req, res }),
    //     playground: configService.env === 'production' ? true : false,
    //     introspection: true,
    //     csrfPrevention: true,
    //     cache: 'bounded',
    //     plugins: [process.env.NODE_ENV !== 'production' ? ApolloServerPluginLandingPageLocalDefault() : {}],
    //     // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    //   }),
    // }),
    FavoriteModule,
    ScheduleModule.forRoot(),
    BankModule,
    BranchGroupModule,
    MenuTemplateModule,
    MenuTemplateProductModule,
    MenuTemplateProductGroupModule,
    UserModule,
    PaymentModule,
    PermissionModule,
    MenuUploadModule,
    CouponModule,
    SocialAuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
    AppService,
    CryptoService,
    StorageService,
    //Upload,
    CronsService,
  ],
})
export class MerchantAppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
