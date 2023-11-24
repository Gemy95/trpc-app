import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BranchModule } from '../../merchant-app/modules/branch/branch.module';
import { CategoryModule } from '../../merchant-app/modules/category/category.module';
import { ClientModule } from '../../merchant-app/modules/client/client.module';
import { MenuModule } from '../../merchant-app/modules/menu/menu.module';
import { OrderModule } from '../../merchant-app/modules/order/order.module';
import { ProductModule } from '../../merchant-app/modules/product/product.module';
import { SearchModule } from '../../merchant-app/modules/search/search.module';
import { TagModule } from '../../merchant-app/modules/tag/tag.module';
import { UserModule } from '../../merchant-app/user/user.module';
import { TrpcRouterService } from './trpc-router.service';
import { TrpcService } from './trpc.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    forwardRef(() => ClientModule),
    forwardRef(() => BranchModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => TagModule),
    forwardRef(() => ProductModule),
    forwardRef(() => MenuModule),
    forwardRef(() => SearchModule),
    forwardRef(() => OrderModule),
  ],
  providers: [TrpcService, TrpcRouterService],
  exports: [TrpcService, TrpcRouterService],
})
export class TrpcModule {}
