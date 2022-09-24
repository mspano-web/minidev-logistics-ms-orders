import { Injectable } from '@nestjs/common';
import {
  RqFindProduct,
  RqGetCustomerDto,
  RsCancelledOrderDto,
  RsCreateOrderDto,
  RsDeleteOrdersDto,
  RsDeliveredOrderDto,
  RsGetOrderDto,
  RsLoadedOrderDto,
} from 'src/dto';
import {
  RsGetOrderDetailsDto,
  RsGetOrderHeaderDto,
} from 'src/dto/rs-get-order.dto';
import {
  RsGetOrdersByDateZoneDetails,
  RsGetOrdersByDateZoneDto,
} from 'src/dto/rs-get-orders-by-date-zone.dto';
import {
  RsGetOrdersDetailsDto,
  RsGetOrdersDto,
  RsGetOrdersHeaderDto,
} from 'src/dto/rs-get-orders.dto';
import { OrderDetails } from 'src/entities/order-details.entity';
import { OrderHeader } from 'src/entities/order-header.entity';
import { IRqRsFactory } from 'src/interfaces';

/* ------------------------------------------------------- */

@Injectable()
export class RqRsFactoryService implements IRqRsFactory {
  createRqGetCustomerDto(id: number): RqGetCustomerDto {
    return new RqGetCustomerDto(id);
  }

  /* ----------- */

  createRqGetProductDto(id: number): RqFindProduct {
    return new RqFindProduct(id.toString());
  }

  /* ----------- */

  createRsCreateOrderDto(
    statusCode: number,
    message?: string,
    id?: number,
  ): RsCreateOrderDto {
    return new RsCreateOrderDto(
      { statusCode, message }, // header
      id // Check if user information is available
        ? {
            // add data
            id: id,
          }
        : null, // without data
    );
  }

  /* ----------- */

  createRsGetOrdersDto(
    statusCode: number,
    message?: string,
    rsGetOrdersHeaderDto?: RsGetOrdersHeaderDto[],
  ): RsGetOrdersDto {
    return new RsGetOrdersDto(
      { statusCode, message }, // header
      rsGetOrdersHeaderDto // Check if user information is available
        ? // add data
          rsGetOrdersHeaderDto
        : null, // without data
    );
  }

  /* ----------- */

  createRsGetOrderDto(
    statusCode: number,
    message?: string,
    rsGetOrderHeaderDto?: RsGetOrderHeaderDto,
  ): RsGetOrderDto {
    return new RsGetOrderDto(
      { statusCode, message }, // header
      rsGetOrderHeaderDto // Check if user information is available
        ? // add data
          rsGetOrderHeaderDto
        : null, // without data
    );
  }

  /* ----------- */

  EntityOrderHeaderToRsOrdersHeaderDto(
    orderHeader: OrderHeader,
  ): RsGetOrdersHeaderDto {
    return new RsGetOrdersHeaderDto(
      orderHeader.amount,
      orderHeader.client_id,
      orderHeader.date_delivery.toDateString(),
      orderHeader.state,
      orderHeader.orderDetails,
    );
  }

  /* ----------- */

  EntityOrderHeaderToRsOrderHeaderDto(
    orderHeader: OrderHeader,
  ): RsGetOrderHeaderDto {
    return new RsGetOrderHeaderDto(
      orderHeader.amount,
      orderHeader.client_id,
      orderHeader.date_delivery.toDateString(),
      orderHeader.state,
      [],
    );
  }

  /* ----------- */

  EntityOrderDetailsToRsOrdersDetailsDto(
    orderDetails: OrderDetails,
  ): RsGetOrdersDetailsDto {
    return new RsGetOrdersDetailsDto(
      orderDetails.product_id,
      orderDetails.quantity,
    );
  }

  /* ----------- */

  EntityOrderDetailsToRsOrderDetailsDto(
    orderDetails: OrderDetails,
  ): RsGetOrderDetailsDto {
    return new RsGetOrderDetailsDto(
      orderDetails.product_id,
      orderDetails.quantity,
    );
  }

  /* ----------- */

  createRsDeleteOrderDto(
    statusCode: number,
    message?: string,
  ): RsDeleteOrdersDto {
    return new RsDeleteOrdersDto(
      { statusCode, message }, // header
    );
  }

  /* ----------- */

  createRsDeliveredOrderDto(
    statusCode: number,
    message?: string,
  ): RsDeliveredOrderDto {
    return new RsDeliveredOrderDto(
      { statusCode, message }, // header
    );
  }

  /* ----------- */

  createRsLoadedOrderDto(
    statusCode: number,
    message?: string,
  ): RsLoadedOrderDto {
    return new RsLoadedOrderDto(
      { statusCode, message }, // header
    );
  }

  /* ----------- */

  createRsCancelledOrderDto(
    statusCode: number,
    message?: string,
  ): RsCancelledOrderDto {
    return new RsCancelledOrderDto(
      { statusCode, message }, // header
    );
  }

  /* ----------- */

  createRsGetOrdersByDateZoneDto(
    statusCode: number,
    message?: string,
    rqGetOrdersDto?: RsGetOrdersByDateZoneDetails[],
  ): RsGetOrdersByDateZoneDto {
    return new RsGetOrdersByDateZoneDto(
      { statusCode, message }, // header
      rqGetOrdersDto,
    );
  }

  /* ----------- */

  createRsGetOrdersByDateZoneDetails(id: number): RsGetOrdersByDateZoneDetails {
    return new RsGetOrdersByDateZoneDetails(id);
  }
}

/* ------------------------------------------------------- */
