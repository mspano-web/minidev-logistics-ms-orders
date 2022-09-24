import { RsGenericHeaderDto } from './rs-generic-header.dto';
import { StateType } from '../types/enums';

/* ------------------------------------------------- */

export class RsGetOrdersDetailsDto {
  product_id: string;
  quantity: number;

  constructor( product_id: string, quantity: number) {
    this.product_id = product_id;
    this.quantity= quantity;
  }
}

/* --------------- */

export class RsGetOrdersHeaderDto {

  state: StateType;
  date_delivery: string;
  client_id: number;
  amount: number;
  rsGetOrdersDetails: RsGetOrdersDetailsDto[];

  constructor( amount: number, client_id: number, date_delivery: string, state: StateType,
    rsGetOrdersDetails: RsGetOrdersDetailsDto[] ) {
    this.amount = amount;
    this.client_id= client_id;
    this.date_delivery = date_delivery;
    this.state = state;
    this.rsGetOrdersDetails = rsGetOrdersDetails;
  }

}

/* --------------- */

export class RsGetOrdersDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetOrdersHeaderDto: RsGetOrdersHeaderDto[];

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rsGetOrdersHeaderDto: RsGetOrdersHeaderDto[],
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsGetOrdersHeaderDto = rsGetOrdersHeaderDto;
  }
}

/* ------------------------------------------------- */