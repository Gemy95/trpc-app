// import { createBullBoard } from './reservation';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateExpressContextOptions, createExpressMiddleware } from '@trpc/server/adapters/express';
import Queue from 'bull';
// import logger from './main-app/lib/logger';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import express from 'express';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware, generateOpenApiDocument } from 'trpc-openapi';
import { v4 as uuid } from 'uuid';

import { MerchantAppModule } from './merchant-app/app.module';
import {
  CLIENT_QUEUE as CLIENT_QUEUE2,
  NOTIFICATION_QUEUE as NOTIFICATION_QUEUE2,
  ORDER_QUEUE as ORDER_QUEUE2,
  OWNER_QUEUE as OWNER_QUEUE2,
} from './merchant-app/modules/common/constants/queue.constants';
// import { TrpcRouterService } from './merchant-app/trpc/context';
// import { openApiDocument } from './merchant-app/trpc/openapi';
import { TrpcRouterService } from './merchant-app/trpc/trpc-router.service';

dotenv.config();
// import loggerMiddleware from './main-app/middleware/logger-middleware';

function setupDocs(app, { name, description, version, path }) {
  const config = new DocumentBuilder()
    .setTitle(name)
    // .setBasePath(path)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}

let AddQueue, RemoveQueue;

async function bootstrap() {
  const merchantApp = await NestFactory.create<NestExpressApplication>(MerchantAppModule);

  ///////////////////////////////Merchant App//////////////////////////

  merchantApp.enableCors();
  merchantApp.use(json({ limit: '5mb' }));
  merchantApp.use(urlencoded({ extended: true }));
  // merchantApp.use(compression());
  merchantApp.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  merchantApp.useStaticAssets(join(__dirname, '..', 'static'));
  // setupDocs(merchantApp, {
  //   name: 'Merchant',
  //   description: 'description',
  //   version: 1,
  //   path: '/merchants/docs',
  // });
  merchantApp.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const trpc = merchantApp.get(TrpcRouterService);
  trpc.applyMiddleware(merchantApp);

  // Handle incoming tRPC requests
  // merchantApp.use('/trpc', createExpressMiddleware({ router: TrpcRouterService.staticAppRouter, createContext }));
  // // Handle incoming OpenAPI requests
  // merchantApp.use('/api', createOpenApiExpressMiddleware({ router: TrpcRouterService.staticAppRouter, createContext }));

  // // Serve Swagger UI with our OpenAPI schema
  // merchantApp.use('/', swaggerUi.serve);
  // merchantApp.get('/', swaggerUi.setup(openApiDocument));

  const redisOptions = {
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  };

  const ownerQueue2 = new Queue(OWNER_QUEUE2, { redis: redisOptions });
  const orderQueue2 = new Queue(ORDER_QUEUE2, { redis: redisOptions });
  const notificationQueue2 = new Queue(NOTIFICATION_QUEUE2, {
    redis: redisOptions,
  });
  const clientQueue2 = new Queue(CLIENT_QUEUE2, { redis: redisOptions });
  // const reservationQueue2 = new Queue(RESERVATION_QUEUE2, {
  //   redis: redisOptions,
  // });

  const serverAdapter2 = new ExpressAdapter();
  serverAdapter2.setBasePath('/bull');

  const { addQueue: addQueue2, removeQueue: removeQueue2 } = createBullBoard({
    queues: [
      new BullAdapter(ownerQueue2),
      new BullAdapter(orderQueue2),
      new BullAdapter(notificationQueue2),
      new BullAdapter(clientQueue2),
      // new BullAdapter(reservationQueue2),
    ],
    serverAdapter: serverAdapter2,
  });

  (AddQueue = addQueue2), (RemoveQueue = removeQueue2);

  await merchantApp.listen(5555, () => {
    // logger.info(`Server is running on port ${5555}`);
    console.log(`Server is running on port ${5555}`);
  });
}

bootstrap();

export { AddQueue, RemoveQueue };
