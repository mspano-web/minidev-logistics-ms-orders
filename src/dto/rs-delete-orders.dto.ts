import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* ----------------------------------- */

export class RsDeleteOrdersDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(rsGenericHeaderDto: RsGenericHeaderDto) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* ----------------------------------- */
