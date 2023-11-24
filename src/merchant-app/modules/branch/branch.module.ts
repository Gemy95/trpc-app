import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TrpcModule } from '../../trpc/trpc.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
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
  Merchant,
  MerchantEmployee,
  MerchantEmployeeRepository,
  MerchantEmployeeSchema,
  MerchantRepository,
  MerchantSchema,
  Product,
  ProductCategory,
  ProductCategoryRepository,
  ProductCategorySchema,
  ProductRepository,
  ProductSchema,
  Review,
  ReviewRepository,
  ReviewSchema,
  Tag,
  TagRepository,
  TagSchema,
  Transaction,
  TransactionRepository,
  TransactionSchema,
} from '../models';
import { ProductModule } from '../product/product.module';
import { BranchRequestsService } from '../requests/branch-requests.service';
import { RequestsModule } from '../requests/requests.module';
import { SettingModule } from '../setting/setting.module';
import { SocketModule } from '../socket/socket.module';
import { BranchController } from './branch.controller';
import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';
import { MarketplaceBranchController } from './marketplace-branch.controller';
import { MarketplaceBranchRouter } from './marketplace-branch.router';
import { MarketplaceBranchService } from './marketplace-branch.service';

@Module({
  imports: [
    forwardRef(() => RequestsModule),
    ProductModule,
    SocketModule,
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Merchant.name, schema: MerchantSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: MenuTemplate.name, schema: MenuTemplateSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Tag.name, schema: TagSchema },
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
    SettingModule,
    forwardRef(() => MerchantEmployeeModule),
    forwardRef(() => TrpcModule),
  ],
  controllers: [BranchController, MarketplaceBranchController],
  providers: [
    BranchService,
    MarketplaceBranchService,
    BranchRepository,
    BranchResolver,
    MerchantRepository,
    TransactionRepository,
    MenuTemplateRepository,
    ProductRepository,
    TagRepository,
    ProductCategoryRepository,
    MarketplaceBranchRouter,
  ],
  exports: [BranchService, BranchRepository, MarketplaceBranchRouter],
})
export class BranchModule {}
