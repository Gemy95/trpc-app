import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { NotificationModule } from '../notification/notification.module';
import { OneSignalModule } from '../onesignal/onesignal.module';
import { OrderModule } from '../order/order.module';
import { OwnerModule } from '../owner/owner.module';
import { RequestsModule } from '../requests/requests.module';
import { DashboardController } from './dashboard.controller';
import { DashboardResolver } from './dashboard.resolver';

@Module({
  imports: [ClientModule, OwnerModule, OrderModule, RequestsModule, OneSignalModule, NotificationModule],
  controllers: [DashboardController],
  providers: [CryptoService, ConfigurationService, DashboardResolver],
})
export class DashboardModule {}
