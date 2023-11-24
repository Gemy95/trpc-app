import { forwardRef, Module } from '@nestjs/common';

import { TrpcModule } from '../../trpc/trpc.module';
import { BranchModule } from '../branch/branch.module';
import { MerchantModule } from '../merchant/merchant.module';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductGroupModule } from '../product-group/product-group.module';
import { ProductModule } from '../product/product.module';
import { ClientMenuController } from './client-menu.controller';
import { ClientMenuResolver } from './client-menu.resolver';
import { ClientMenuRouter } from './client-menu.router';
import { ClientMenuService } from './client-menu.service';
import { MenuController } from './menu.controller';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { MenuSharedService } from './shared/menu.shared.service';

@Module({
  imports: [
    MerchantModule,
    ProductCategoryModule,
    ProductGroupModule,
    forwardRef(() => ProductModule),
    forwardRef(() => BranchModule),
    forwardRef(() => TrpcModule),
  ],
  controllers: [MenuController, ClientMenuController],
  providers: [MenuService, ClientMenuService, MenuSharedService, MenuResolver, ClientMenuResolver, ClientMenuRouter],
  exports: [ClientMenuRouter],
})
export class MenuModule {}
