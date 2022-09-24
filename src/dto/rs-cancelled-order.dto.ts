import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* -------------------------------------- */

export class RsCancelledOrderDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(rsGenericHeaderDto: RsGenericHeaderDto) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* -------------------------------------- */
