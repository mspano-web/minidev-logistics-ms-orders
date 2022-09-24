import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

/* ------------------------------------------------------------- */

async function bootstrap() {

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const host = configService.get<string>('ORDER_HOST')
  const port = parseInt(configService.get<string>('ORDER_PORT'))

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host:  host,
      port:  port, 
    },
  };


  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions
  );

  await app.listen();
}

/* ------------------------------------------------------------- */

bootstrap();
