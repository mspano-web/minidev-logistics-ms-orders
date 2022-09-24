import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqGetCustomerDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    constructor(id: number) {
        this.id = id;
    }
}

/* -------------------------------------- */
