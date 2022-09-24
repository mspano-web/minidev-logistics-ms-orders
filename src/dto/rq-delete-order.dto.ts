
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqDeleteOrderDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

/* -------------------------------------- */
