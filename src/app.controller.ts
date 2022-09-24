import { Controller, } from '@nestjs/common';
import {
  EventPattern, MessagePattern,
} from '@nestjs/microservices';

import { AppService } from './app.service';
import {
  RqCreateOrderDto,
  RqDeleteOrderDto,
  RqGetOrderDto,
  RqGetOrdersByDateZoneDto,
  RsCreateOrderDto,
  RsGetOrderDto,
  RsGetOrdersDto,
} from './dto';
import { RsGetOrdersByDateZoneDto } from './dto/rs-get-orders-by-date-zone.dto';

/* ------------------------------------------------------------- */

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
  ) {}

  /* ------------------- */


  @EventPattern('order-created')
  async create(payload: RqCreateOrderDto): Promise<RsCreateOrderDto>  {
      return await this.appService.create(payload);
  }

  /* ------------------- */

  @MessagePattern('ms-order-get')
  async getOrder(rqGetOrderDto: RqGetOrderDto): Promise<RsGetOrderDto> {
    return await this.appService.getOrder(rqGetOrderDto.id);
  }

  /* ------------------- */

  @MessagePattern('ms-orders-get')
  async getOrders(): Promise<RsGetOrdersDto> {
    return await this.appService.getOrders();
  }

  /* ------------------- */

  
  @MessagePattern('ms-order-delete')
  async deleteOrder(rqDeleteOrderDto: RqDeleteOrderDto) {
    return await this.appService.deleteOrder(rqDeleteOrderDto.id);
  }

  /* ------------------- */

  @MessagePattern('ms-order-delivered')
  async deliveredOrder(message) {
    return await this.appService.deliveredOrder(message.key);
  }

  /* ------------------- */
  
  @MessagePattern('ms-order-loaded')
  async loadedOrder(message) {

    return await this.appService.loadedOrder(message.key);
  }

  /* ------------------- */
  
  @MessagePattern('ms-order-cancelled')
  async cancelledOrder(message) {
    return await this.appService.cancelledOrder(message.key);
  }

  /* ------------------- */
  
  @MessagePattern('ms-orders-get-by-date-zone')
  async getOrdersByDateZone(rqDto: RqGetOrdersByDateZoneDto): Promise<RsGetOrdersByDateZoneDto> {
    const { date_delivery, zone_id } = rqDto;

    return await this.appService.getOrdersByDateZone(
      date_delivery,
      zone_id ,
    );
  }

}

/* ------------------------------------------------------------- */
