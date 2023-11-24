import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { Driver, DriverSchema } from '../../../libs/database/src/lib/models/driver/driver.schema';
import { Order, OrderSchema } from '../../../libs/database/src/lib/models/order/order.schema';
import { TrpcModule } from '../../trpc/trpc.module';
import { BranchModule } from '../branch/branch.module';
import { NOTIFICATION_QUEUE, ORDER_QUEUE } from '../common/constants/queue.constants';
import { ConfigurationModule } from '../config/configuration.module';
import { CouponModule } from '../coupon/coupon.module';
import { MailService } from '../mail/mail.service';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import {
  Address,
  AddressRepository,
  AddressSchema,
  Counter,
  CounterRepository,
  CounterSchema,
  DraftOrder,
  DraftOrderSchema,
  OrderRepository,
  TableRepository,
} from '../models';
import { Setting, SettingSchema } from '../models';
import { DriverRepository } from '../models/driver/driver.repository';
import { DraftOrderRepository } from '../models/order/order-draft.repository';
import { SettingRepository } from '../models/setting/setting.repository';
import { NotificationModule } from '../notification/notification.module';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { ProductGroupModule } from '../product-group/product-group.module';
import { ProductModule } from '../product/product.module';
import { SocketModule } from '../socket/socket.module';
import { TableModule } from '../table/table.module';
import { DashboardOrderController } from './dashboard-order.controller';
import { DashboardOrderResolver } from './dashboard-order.resolver';
import { DashboardOrderService } from './dashboard-order.service';
import { DriverOrderController } from './driver-order.controller';
import { DriverOrderResolver } from './driver-order.resolver';
import { DriverOrderService } from './driver-order.service';
import { DashboardOrderFactoryService } from './factory/dashboard-order.factory.service';
import { MarketplaceOrderDraftRouter } from './marketplace-order-draft.router';
import { MarketplaceOrderController } from './marketplace-order.controller';
import { MarketplaceOrderRouter } from './marketplace-order.router';
import { MarketplaceOrderService } from './marketplace-order.service';
import { OrderNotificationProcessor } from './order-notification.process';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: ORDER_QUEUE,
      },
      {
        name: NOTIFICATION_QUEUE,
      },
    ),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: Driver.name, schema: DriverSchema },
      { name: Address.name, schema: AddressSchema },
      { name: DraftOrder.name, schema: DraftOrderSchema },
    ]),
    OneSignalModule,
    SocketModule,
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
      },
    ]),
    NotificationModule,
    ConfigurationModule,
    forwardRef(() => ProductModule),
    forwardRef(() => ProductGroupModule),
    forwardRef(() => BranchModule),
    forwardRef(() => MerchantEmployeeModule),
    forwardRef(() => TableModule),
    forwardRef(() => CouponModule),
    forwardRef(() => TrpcModule),
  ],
  controllers: [MarketplaceOrderController, DashboardOrderController, DriverOrderController],
  providers: [
    MarketplaceOrderService,
    DashboardOrderService,
    DashboardOrderFactoryService,
    OrderRepository,
    CounterRepository,
    OrderProcessor,
    OrderNotificationProcessor,
    MailService,
    DashboardOrderResolver,
    SettingRepository,
    DriverOrderResolver,
    DriverOrderService,
    DriverRepository,
    AddressRepository,
    MarketplaceOrderRouter,
    DraftOrderRepository,
    MarketplaceOrderDraftRouter,
  ],
  exports: [
    DashboardOrderService,
    OrderRepository,
    DriverOrderService,
    MarketplaceOrderRouter,
    MarketplaceOrderDraftRouter,
  ],
})
export class OrderModule {}
