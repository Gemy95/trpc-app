import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MarketplaceReservationService } from './marketplace-reservation.service';
import { DashboardReservationController } from './dashboard-reservation.controller';
import {
  Reservation,
  ReservationSchema,
  ReservationRepository,
  BranchRepository,
  Branch,
  BranchSchema,
  Merchant,
  MerchantSchema,
  MerchantRepository,
  TableRepository,
  Table,
  TableSchema,
} from '../models';
import { RESERVATION_QUEUE } from './reservation.constants';
import { ReservationProcessor } from './reservation.processor';
import { MarketplaceReservationController } from './marketplace-reservation.controller';
import { DashboardReservationService } from './dashboard-reservation.service';
import { SettingModule } from '../setting/setting.module';
import { MarketplaceReservationResolver } from './marketplace-reservation.resolver';
import { SharedReservationService } from './reservation.shared.service';
import { MerchantReservationService } from './merchant-reservation.service';
import { MerchantReservationResolver } from './merchant-reservation.resolver';
import { BullModuleConfig } from '../bull/bull.module';
import { OrderModule } from '../order/order.module';
import { MerchantEmployeeModule } from '../merchant-employee/merchant-employee.module';
import { MailService } from '../mail/mail.service';
import { ConfigurationService } from '../config/configuration.service';
@Module({
  imports: [
    BullModuleConfig,
    BullModule.registerQueue({
      name: RESERVATION_QUEUE,
    }),
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Merchant.name, schema: MerchantSchema },
      { name: Table.name, schema: TableSchema },
    ]),
    SettingModule,
    OrderModule,
    MerchantEmployeeModule,
  ],
  controllers: [DashboardReservationController, MarketplaceReservationController],
  providers: [
    MarketplaceReservationService,
    DashboardReservationService,
    ReservationRepository,
    BranchRepository,
    ReservationProcessor,
    MarketplaceReservationResolver,
    BranchRepository,
    SharedReservationService,
    MerchantReservationService,
    MerchantReservationResolver,
    MerchantRepository,
    TableRepository,
    MailService,
    ConfigurationService,
  ],
  exports: [MarketplaceReservationService, DashboardReservationService, ReservationRepository],
})
export class ReservationModule {}
