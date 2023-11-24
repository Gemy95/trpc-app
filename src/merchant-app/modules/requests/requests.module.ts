import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AttachmentsModule } from '../attachments/attachments.module';
import { NOTIFICATION_QUEUE } from '../common/constants/queue.constants';
import { MailModule } from '../mail/mail.module';
import { MenuTemplateProductGroupModule } from '../menu-template-product-group/menu-template-product-group.module';
import { MenuTemplateProductModule } from '../menu-template-product/menu-template-product.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import { MerchantModule } from '../merchant/merchant.module';
import {
  Branch,
  BranchRepository,
  BranchSchema,
  City,
  CityRepository,
  CitySchema,
  MenuTemplate,
  MenuTemplateRepository,
  MenuTemplateSchema,
  ProductCategory,
  ProductCategoryRepository,
  ProductCategorySchema,
  ProductGroup,
  ProductGroupRepository,
  ProductGroupSchema,
  Review,
  ReviewRepository,
  ReviewSchema,
} from '../models';
import { NotificationModule } from '../notification/notification.module';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { ProductModule } from '../product/product.module';
import { SettingModule } from '../setting/setting.module';
import { SocketModule } from '../socket/socket.module';
import { BranchRequestsController } from './branch-requests.controller';
import { BranchRequestsResolver } from './branch-requests.resolver';
import { BranchRequestsService } from './branch-requests.service';
import { MerchantRequestsController } from './merchant-requests.controller';
import { MerchantRequestsResolver } from './merchant-requests.resolver';
import { MerchantRequestsService } from './merchant-requests.service';
import { AllReviewsUnionResolver } from './notification.union.resolver';
import { ProductRequestsController } from './product-requests.controller';
import { ProductRequestsResolver } from './product-requests.resolver';
import { ProductRequestsService } from './product-requests.service';
import { RequestProcess } from './requests-notification.process';
import { RequestsService } from './requests.service';
import { AllReviewsRequestsUnionResolver } from './requests.union.resolver';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: City.name, schema: CitySchema },
      { name: MenuTemplate.name, schema: MenuTemplateSchema },
      { name: ProductCategory.name, schema: ProductCategorySchema },
      { name: ProductGroup.name, schema: ProductGroupSchema },
    ]),
    forwardRef(() => MerchantModule),
    forwardRef(() => ProductModule),
    MailModule,
    SocketModule,
    AttachmentsModule,
    NotificationModule,
    OneSignalModule,
    SettingModule,
    forwardRef(() => MerchantEmployeeModule),
    MenuTemplateProductModule,
    MenuTemplateProductGroupModule,
  ],
  controllers: [MerchantRequestsController, ProductRequestsController, BranchRequestsController],
  providers: [
    RequestsService,
    MerchantRequestsService,
    ProductRequestsService,
    ReviewRepository,
    RequestProcess,
    BranchRepository,
    MerchantRequestsResolver,
    ProductRequestsResolver,
    CityRepository,
    BranchRequestsResolver,
    BranchRequestsService,
    AllReviewsUnionResolver,
    AllReviewsRequestsUnionResolver,
    MenuTemplateRepository,
    ProductCategoryRepository,
    ProductGroupRepository,
  ],
  exports: [MerchantRequestsService, ProductRequestsService, RequestsService, BranchRequestsService],
})
export class RequestsModule {}
