/* -------------------------------------- */

export class RsCustomer {
  id: number;
  name: string;
  address: string;
  location: string;
  zone_id: number;
  role_id: number;
}

/* -------------------------------------- */

export class RsGetCustomesByZoneDto {
  statusCode: number;
  message: string;

  customers: RsCustomer[];
}

/* -------------------------------------- */
