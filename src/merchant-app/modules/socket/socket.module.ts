import { Module } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { OrderSocketGateway } from './order.socket.gateway';
import { OperationDepartmentsGateWay } from './department.socket.gateway';
import { MerchantGateWay } from './merchant.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OrderSocketGateway, OperationDepartmentsGateWay, MerchantGateWay, CryptoService, ConfigurationService],
  exports: [OrderSocketGateway, OperationDepartmentsGateWay, MerchantGateWay],
})
export class SocketModule {}
