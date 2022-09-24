import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';

import { Repository, DataSource } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { ProductServices } from './grpc-product/product.pb';

import {
  RqCreateOrderDto,
  RqGetCustomersByZoneDto,
  RsCancelledOrderDto,
  RsCreateOrderDto,
  RsDeleteOrdersDto,
  RsDeliveredOrderDto,
  RsGetCustomerDto,
  RsGetCustomesByZoneDto,
  RsGetOrderDto,
  RsGetOrdersDto,
  RsLoadedOrderDto,
} from './dto';
import { OrderHeader } from './entities/order-header.entity';
import { OrderDetails } from './entities/order-details.entity';
import { IRqRsFactory, RQ_RS_FACTORY_SERVICE } from './interfaces';
import { StateType } from './types/enums';
import { RsGetOrdersByDateZoneDto } from './dto/rs-get-orders-by-date-zone.dto';

/* ----------------------------------------------------- */

@Injectable()
export class AppService {
  private srv: ProductServices;

  constructor(
    @InjectRepository(OrderHeader)
    private readonly orderHeaderRepository: Repository<OrderHeader>,

    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,

    private dataSource: DataSource,

    @Inject(RQ_RS_FACTORY_SERVICE)
    private readonly rqRsFactoryService: IRqRsFactory,

    @Inject('CUSTOMER_TRANSPORT') private customer_transport: ClientProxy,

    @Inject('PRODUCT_TRANSPORT') private client: ClientGrpc,
  ) {}

  /* ------------------- */

  onModuleInit() {
    this.srv = this.client.getService<ProductServices>('ProductServices');
  }

  /* ----------------- */

  async create(order: RqCreateOrderDto): Promise<RsCreateOrderDto> {
    let rsCreateOrderDto: RsCreateOrderDto = null;
    try {
      const rqGetCustomerDto = this.rqRsFactoryService.createRqGetCustomerDto(
        order.client_id,
      );
      const resCustomer = await firstValueFrom(
        this.customer_transport.send<RsGetCustomerDto>(
          'ms-customer-get',
          rqGetCustomerDto,
        ),
      );
      if (resCustomer.rsGenericHeaderDto.statusCode !== HttpStatus.OK) {
        rsCreateOrderDto = this.rqRsFactoryService.createRsCreateOrderDto(
          HttpStatus.FAILED_DEPENDENCY,
          'Fail Customer Dependency in Create Order',
          null,
        );
        console.log(
          '[ms-orders][order-created][service] (',
          rsCreateOrderDto,
          ')',
        );
      } else {
        if (
          order.rqCreateOrderDetailsDto !== undefined &&
          order.rqCreateOrderDetailsDto !== null &&
          order.rqCreateOrderDetailsDto.length != 0
        ) {
          const rqFindProduct =
            this.rqRsFactoryService.createRqGetProductDto(0);

          new Promise((resolve, reject) => {
            order.rqCreateOrderDetailsDto.forEach(
              async (element, index, array) => {
                rqFindProduct.id = element.product_id;
                const resProduct = await firstValueFrom(
                  this.srv.getProduct(rqFindProduct),
                );
                if (resProduct.status !== HttpStatus.OK) {
                  rsCreateOrderDto =
                    this.rqRsFactoryService.createRsCreateOrderDto(
                      HttpStatus.FAILED_DEPENDENCY,
                      `Fail Product Dependency in Create Order - ${rqFindProduct.id}`,
                      null,
                    );
                  reject();
                }
                if (index === array.length - 1) resolve('done');
              },
            );
          })
            .then(async () => {
              if (rsCreateOrderDto === null) {
                const queryRunner = this.dataSource.createQueryRunner();
                try {
                  await queryRunner.connect();
                  await queryRunner.startTransaction();
                  const orderHeader = this.orderHeaderRepository.create(order);
                  await queryRunner.manager.save(orderHeader);

                  order.rqCreateOrderDetailsDto.map(async (od) => {
                    const orderDetails = this.orderDetailsRepository.create({
                      product_id: od.product_id,
                      quantity: od.quantity,
                      orderHeader: orderHeader,
                    });
                    await queryRunner.manager.save(orderDetails);
                  });
                  await queryRunner.commitTransaction();
                  rsCreateOrderDto =
                    this.rqRsFactoryService.createRsCreateOrderDto(
                      HttpStatus.OK,
                      '',
                      null,
                    );
                } catch (err) {
                  await queryRunner.rollbackTransaction();
                } finally {
                  await queryRunner.release();
                }
              }
              console.log(
                '[ms-orders][order-created][service] (',
                rsCreateOrderDto,
                ')',
              );
              return rsCreateOrderDto;
            })
            .catch(() => {
              rsCreateOrderDto = this.rqRsFactoryService.createRsCreateOrderDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Create Order Fail!',
                null,
              );
              console.log(
                '[ms-orders][order-created][service] (',
                rsCreateOrderDto,
                ')',
              );
              return rsCreateOrderDto;
            });
        }
      }
      return rsCreateOrderDto;
    } catch (err) {
      rsCreateOrderDto = this.rqRsFactoryService.createRsCreateOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Create Order Fail!',
        null,
      );
      console.log(
        '[ms-orders][order-created][service] (',
        rsCreateOrderDto,
        ')',
      );
    }
  }

  /* ----------------- */

  async getOrder(idGet: number): Promise<RsGetOrderDto> {
    let rsGetOrderDTO;

    try {
      const orderDB = await this.orderHeaderRepository.find({
        relations: { orderDetails: true },
        where: {
          id: idGet,
        },
      });

      if (orderDB && orderDB.length) {
        const rsGetOrderHeaderDto =
          this.rqRsFactoryService.EntityOrderHeaderToRsOrderHeaderDto(
            orderDB[0],
          );
        orderDB[0].orderDetails.map((detail) => {
          const rsGetOrderDetails =
            this.rqRsFactoryService.EntityOrderDetailsToRsOrderDetailsDto(
              detail,
            );
          rsGetOrderHeaderDto.rsGetOrderDetails.push(rsGetOrderDetails);
        });

        rsGetOrderDTO = this.rqRsFactoryService.createRsGetOrderDto(
          HttpStatus.OK,
          '',
          rsGetOrderHeaderDto,
        );
      } else {
        rsGetOrderDTO = this.rqRsFactoryService.createRsGetOrderDto(
          HttpStatus.NOT_FOUND,
          'Order Not Found',
          null,
        );
      }
    } catch (e) {
      rsGetOrderDTO = this.rqRsFactoryService.createRsGetOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Fail to Get Order',
        null,
      );
    }
    console.log('[ms-order-get][service] (', rsGetOrderDTO, ')');
    return rsGetOrderDTO;
  }

  /* ----------------- */

  async getOrders(): Promise<RsGetOrdersDto> {
    const rsGetOrdersDTO = this.rqRsFactoryService.createRsGetOrdersDto(
      HttpStatus.OK,
      '',
      [],
    );

    try {
      const ordersDB = await this.orderHeaderRepository.find({
        relations: { orderDetails: true },
      });
      console.log("ordersDB:", ordersDB)
      if (ordersDB) {
        ordersDB.forEach((order) => {
          console.log("CICLANDO order:", order)
          const rsGetOrdersHeaderDto =
            this.rqRsFactoryService.EntityOrderHeaderToRsOrdersHeaderDto(order);
           rsGetOrdersDTO.rsGetOrdersHeaderDto.push(rsGetOrdersHeaderDto);
           
        });
      } else {
        rsGetOrdersDTO.rsGenericHeaderDto.statusCode = HttpStatus.NOT_FOUND;
        rsGetOrdersDTO.rsGenericHeaderDto.message = 'Get Orders Empty';
        rsGetOrdersDTO.rsGetOrdersHeaderDto = [];
      }
    } catch (e) {
      rsGetOrdersDTO.rsGenericHeaderDto.statusCode =
        HttpStatus.INTERNAL_SERVER_ERROR;
      rsGetOrdersDTO.rsGenericHeaderDto.message = 'Get Orders Fail';
      rsGetOrdersDTO.rsGetOrdersHeaderDto = [];
    }
    console.log('[ms-orders-get][service] (', rsGetOrdersDTO, ')');
    return rsGetOrdersDTO;
  }

  /* ----------------- */

  async deleteOrder(idDelete: number): Promise<RsDeleteOrdersDto> {
    let rsDeleteOrdersDto = null;
    try {
      const res = await this.orderHeaderRepository.delete(idDelete);
      if (res.affected) {
        rsDeleteOrdersDto = this.rqRsFactoryService.createRsDeleteOrderDto(
          HttpStatus.OK,
          '',
        );
      } else {
        rsDeleteOrdersDto = this.rqRsFactoryService.createRsDeleteOrderDto(
          HttpStatus.NOT_FOUND,
          'Delete Order Not Found!',
        );
      }
    } catch (e) {
      rsDeleteOrdersDto = this.rqRsFactoryService.createRsDeleteOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Delete Order Fail!',
      );
    }
    console.log('[ms-order-delete][service] (', rsDeleteOrdersDto, ')');
    return rsDeleteOrdersDto;
  }

  /* ----------------- */

  async deliveredOrder(id: number): Promise<RsDeliveredOrderDto> {
    let rsDeliveredOrderDto: RsDeliveredOrderDto = null;

    try {
      const orderHeader = await this.orderHeaderRepository.findOneBy({
        id,
      });
      if (orderHeader) {
        orderHeader.state = StateType.DELIVERED;
        await this.orderHeaderRepository.save(orderHeader);
        rsDeliveredOrderDto = this.rqRsFactoryService.createRsDeliveredOrderDto(
          HttpStatus.OK,
          '',
        );
      } else {
        rsDeliveredOrderDto = this.rqRsFactoryService.createRsDeliveredOrderDto(
          HttpStatus.NOT_FOUND,
          'Delivered Fail. Order Not Found!',
        );
      }
    } catch (e) {
      rsDeliveredOrderDto = this.rqRsFactoryService.createRsDeliveredOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Delievered Order Fail!',
      );
    }
    console.log('[ms-order-delivered][service] (', rsDeliveredOrderDto, ')');

    return rsDeliveredOrderDto;
  }

  /* ----------------- */

  async loadedOrder(id: number): Promise<RsLoadedOrderDto> {
    let rsLoadedOrderDto: RsLoadedOrderDto = null;

    try {
      const orderHeader = await this.orderHeaderRepository.findOneBy({
        id,
      });
      if (orderHeader) {
        orderHeader.state = StateType.IN_PROGRESS;
        await this.orderHeaderRepository.save(orderHeader);
        rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
          HttpStatus.OK,
          '',
        );
      } else {
        rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
          HttpStatus.NOT_FOUND,
          'Loaded Fail. Order Not Found!',
        );
      }
    } catch (e) {
      rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Loaded Order Fail!',
      );
    }
    console.log('[ms-order-loaded][service] (', rsLoadedOrderDto, ')');

    return rsLoadedOrderDto;
  }

  /* ----------------- */

  async cancelledOrder(id: number): Promise<RsCancelledOrderDto> {
    let rsCancelledOrderDto: RsCancelledOrderDto = null;

    try {
      const orderHeader = await this.orderHeaderRepository.findOneBy({
        id,
      });
      if (orderHeader) {
        orderHeader.state = StateType.CANCELLED;
        await this.orderHeaderRepository.save(orderHeader);
        rsCancelledOrderDto = this.rqRsFactoryService.createRsCancelledOrderDto(
          HttpStatus.OK,
          '',
        );
      } else {
        rsCancelledOrderDto = this.rqRsFactoryService.createRsCancelledOrderDto(
          HttpStatus.NOT_FOUND,
          'Cancelled Fail. Order Not Found!',
        );
      }
    } catch (e) {
      rsCancelledOrderDto = this.rqRsFactoryService.createRsCancelledOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Cancelled Order Fail!',
      );
    }
    console.log('[ms-order-cancelled][service] (', rsCancelledOrderDto, ')');

    return rsCancelledOrderDto;
  }

  /* ----------------- */

  async getOrdersByDateZone(
    rq_date_delivery: string,
    rq_zone_id: number,
  ): Promise<RsGetOrdersByDateZoneDto> {
    let rsGetOrdersByDateZoneDto: RsGetOrdersByDateZoneDto = null;

    try {
      const rqGetCustomersByZoneDto: RqGetCustomersByZoneDto = {
        zone_id: rq_zone_id,
      };
      
      const resCustomer: RsGetCustomesByZoneDto = await firstValueFrom(
        this.customer_transport.send(
          'ms-customers-by-zone-get',
          rqGetCustomersByZoneDto,
        ),
      );

      if (resCustomer && resCustomer.customers.length) {
        const customerIdMap = resCustomer.customers.map((elem) => {
          return elem.id;
        });

        const today = new Date(rq_date_delivery);
        const tomorrow_wrk = new Date(rq_date_delivery);
        const tomorrow = new Date(
          tomorrow_wrk.setDate(tomorrow_wrk.getDate() + 1),
        );
  
        const ordersDB = await this.orderHeaderRepository
          .createQueryBuilder()
          .where('client_id IN (:...clients)', { clients: customerIdMap })
          .andWhere('date_delivery >= :startDate', { startDate: today })
          .andWhere('date_delivery < :endDate', { endDate: tomorrow })
          .orderBy('date_delivery')
          .getMany();
  
        if (ordersDB) {
          const ordersIdMap = ordersDB.map((elem) => {
            return elem.id;
          });
         
          rsGetOrdersByDateZoneDto = this.rqRsFactoryService.createRsGetOrdersByDateZoneDto(
            HttpStatus.OK, '', [] );
  
          ordersIdMap.map((elem) => {
            const rsGODetailsDTO = this.rqRsFactoryService.createRsGetOrdersByDateZoneDetails(elem)
            rsGetOrdersByDateZoneDto.rqGetOrdersDto.push(rsGODetailsDTO);
            return;
          });

        } else {
          rsGetOrdersByDateZoneDto = this.rqRsFactoryService.createRsGetOrdersByDateZoneDto(
            HttpStatus.NOT_FOUND, 'Get Orders By Zone Fail! Orders Not Found', null );
        }
      } else {
        rsGetOrdersByDateZoneDto = this.rqRsFactoryService.createRsGetOrdersByDateZoneDto(
          HttpStatus.NOT_FOUND, 'Get Orders By Zone Fail! Customers Not Found', null );
      }
    } catch (e) {
      rsGetOrdersByDateZoneDto =
        this.rqRsFactoryService.createRsGetOrdersByDateZoneDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Get Orders By Zone Fail! ',
        );
    }
    console.log(
      '[ms-orders-get-by-date-zone][service] (',
      rsGetOrdersByDateZoneDto,
      ')',
    );

    return rsGetOrdersByDateZoneDto;
  }
}

/* ----------------------------------------------------- */
