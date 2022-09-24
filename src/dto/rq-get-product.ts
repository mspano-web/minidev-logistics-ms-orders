import { Exclude, Expose } from "class-transformer";
import {  IsString,  } from "class-validator";
import { RqFindProducts } from "src/grpc-product/product.pb";

/* -------------------------------------- */

@Exclude()
export class RqFindProduct implements RqFindProducts {
    @Expose()
    @IsString()
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}

/* -------------------------------------- */
