import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrpcModule } from '../../trpc/trpc.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { DiscountModule } from '../discount/discount.module';
import { MailModule } from '../mail/mail.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import { MerchantModule } from '../merchant/merchant.module';
import { Product, ProductGroup, ProductGroupRepository, ProductGroupSchema, ProductRepository, ProductSchema } from '../models';
import { RequestsModule } from '../requests/requests.module';
import { MarketplaceProductController } from './marketplace-product.controller';
import { MarketplaceProductRouter } from './marketplace-product.router';
import { MarketplaceProductService } from './marketplace.product.service';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductGroup.name, schema: ProductGroupSchema },
    ]),
    MailModule,
    DiscountModule,
    AttachmentsModule,
    forwardRef(() => MerchantModule),
    forwardRef(() => RequestsModule),
    forwardRef(() => MerchantEmployeeModule),
    forwardRef(() => TrpcModule),
  ],
  controllers: [MarketplaceProductController, ProductController],
  providers: [
    ProductService,
    MarketplaceProductService,
    ProductRepository,
    ProductResolver,
    ProductGroupRepository,
    MarketplaceProductRouter,
  ],
  exports: [ProductService, ProductRepository, MarketplaceProductRouter],
})
export class ProductModule {}
