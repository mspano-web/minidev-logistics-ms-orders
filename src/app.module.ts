import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderDetails } from './entities/order-details.entity';
import { OrderHeader } from './entities/order-header.entity';
import { RQ_RS_FACTORY_SERVICE } from './interfaces';
import { RqRsFactoryService } from './services/rq-rs-factory.service';

/* ------------------------------------------------------------- */

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [OrderDetails, OrderHeader],
        synchronize: configService.get('DB_SYNC').toLowerCase() === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([OrderDetails, OrderHeader]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'PRODUCT_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, './grpc-product/product.proto'),
            url: configService.get('URL_PRODUCTS'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'CUSTOMER_TRANSPORT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('CUSTOMER_HOST'),
            port: configService.get('CUSTOMER_PORT'),
          },
        }),
    },
    {
      useClass: RqRsFactoryService, // You can switch useClass to different implementation
      provide: RQ_RS_FACTORY_SERVICE,
    },
  ],
})

/* ------------------------------------------------------------- */

export class AppModule {}
