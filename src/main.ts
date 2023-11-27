import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { TrpcRouterService } from './app/trpc/trpc-router.service';

dotenv.config();

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
  const App = await NestFactory.create<NestExpressApplication>(AppModule);

  App.enableCors();
  App.use(json({ limit: '5mb' }));
  App.use(urlencoded({ extended: true }));
  // App.use(compression());
  App.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  App.useStaticAssets(join(__dirname, '..', 'static'));
  // setupDocs(App, {
  //   name: 'App',
  //   description: 'description',
  //   version: 1,
  //   path: '/app/docs',
  // });
  App.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const trpc = App.get(TrpcRouterService);
  trpc.applyMiddleware(App);

  // Handle incoming tRPC requests
  // App.use('/trpc', createExpressMiddleware({ router: TrpcRouterService.staticAppRouter, createContext }));
  // // Handle incoming OpenAPI requests
  // App.use('/api', createOpenApiExpressMiddleware({ router: TrpcRouterService.staticAppRouter, createContext }));

  // // Serve Swagger UI with our OpenAPI schema
  // App.use('/', swaggerUi.serve);
  // App.get('/', swaggerUi.setup(openApiDocument));

  await App.listen(5555, () => {
    // logger.info(`Server is running on port ${5555}`);
    console.log(`Server is running on port ${5555}`);
  });
}

bootstrap();

export { AddQueue, RemoveQueue };
