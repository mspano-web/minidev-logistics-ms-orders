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

//   interface and provide that token when injecting to an interface type.
export const RQ_RS_FACTORY_SERVICE = 'RQ_RS_FACTORY_SERVICE';

/* ----------------------- */

export interface IRqRsFactory {
  createRqGetCustomerDto(id: number): RqGetCustomerDto;

  /* ---------- */

  createRqGetProductDto(id: number): RqFindProduct;

  /* ---------- */

  createRsCreateOrderDto(
    statusCode: number,
    message?: string,
    id?: number,
  ): RsCreateOrderDto;

  /* ---------- */

  EntityOrderHeaderToRsOrdersHeaderDto(
    orderHeader: OrderHeader,
  ): RsGetOrdersHeaderDto;

  /* ---------- */

  EntityOrderDetailsToRsOrdersDetailsDto(
    orderDetails: OrderDetails,
  ): RsGetOrdersDetailsDto;

  /* ---------- */

  createRsGetOrdersDto(
    statusCode: number,
    message?: string,
    rsGetOrdersHeaderDto?: RsGetOrdersHeaderDto[],
  ): RsGetOrdersDto;

  /* ---------- */

  createRsGetOrderDto(
    statusCode: number,
    message?: string,
    rsGetOrderHeaderDto?: RsGetOrderHeaderDto,
  ): RsGetOrderDto;

  /* ---------- */

  EntityOrderHeaderToRsOrderHeaderDto(
    orderHeader: OrderHeader,
  ): RsGetOrderHeaderDto;

  /* ---------- */

  EntityOrderDetailsToRsOrderDetailsDto(
    orderDetails: OrderDetails,
  ): RsGetOrderDetailsDto;

  /* ---------- */

  createRsDeleteOrderDto(
    statusCode: number,
    message?: string,
  ): RsDeleteOrdersDto;

  /* ---------- */

  createRsDeliveredOrderDto(
    statusCode: number,
    message?: string,
  ): RsDeliveredOrderDto;

  /* ---------- */

  createRsLoadedOrderDto(
    statusCode: number,
    message?: string,
  ): RsLoadedOrderDto;

  /* ---------- */

  createRsCancelledOrderDto(
    statusCode: number,
    message?: string,
  ): RsCancelledOrderDto;

  /* ---------- */

  createRsGetOrdersByDateZoneDto(
    statusCode: number,
    message?: string,
    rqGetOrdersDto?: RsGetOrdersByDateZoneDetails[],
  ): RsGetOrdersByDateZoneDto;

  /* ---------- */

  createRsGetOrdersByDateZoneDetails(id: number): RsGetOrdersByDateZoneDetails;
}

/* ----------------------- */
