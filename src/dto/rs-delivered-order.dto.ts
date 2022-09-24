import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class RsDeliveredOrderDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(rsGenericHeaderDto: RsGenericHeaderDto) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* ----------------------------------- */
