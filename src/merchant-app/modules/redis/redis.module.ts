import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { REDIS_CLIENT_NAME_SPACE } from '../common/constants/client.constants';
import { REDIS_MERCHANT_EMPLOYEE_NAME_SPACE } from '../common/constants/merchant-employee';
import { REDIS_ORDER_NAME_SPACE } from '../common/constants/order.constants';
import { REDIS_OWNER_NAME_SPACE } from '../common/constants/owner.constants';
import { REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE } from '../common/constants/shoppex.employee.constants';
import { PARTICIPANTS_NAMESPACE, ROOMS_NAMESPACE } from '../common/constants/socket.constants';
import { ConfigurationModule } from '../config/configuration.module';
import { ConfigurationService } from '../config/configuration.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => {
        return {
          readyLog: true,
          config: [
            {
              // url: configService.redis.REDIS_URL,
              url: process.env.REDIS_URL,
              namespace: REDIS_OWNER_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: REDIS_CLIENT_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: REDIS_MERCHANT_EMPLOYEE_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: REDIS_ORDER_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: PARTICIPANTS_NAMESPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: process.env.REDIS_URL,
              namespace: ROOMS_NAMESPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
          ],
        };
      },
      inject: [ConfigurationService],
    }),
  ],
})
export class RedisModuleConfig {}
