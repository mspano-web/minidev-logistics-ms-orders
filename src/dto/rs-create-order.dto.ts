import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* -------------------------------------- */

export class RsCreateOrderDataDto {
  id?: number;
}

/* -------------------------------------- */

export class RsCreateOrderDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsCreateOrderDataDto: RsCreateOrderDataDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rsCreateOrderDataDto: RsCreateOrderDataDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsCreateOrderDataDto = rsCreateOrderDataDto;
  }
}

/* -------------------------------------- */


/* ----------------------------------- */
