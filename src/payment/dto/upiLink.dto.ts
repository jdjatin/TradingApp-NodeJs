import { IsNotEmpty, IsInt } from "class-validator";

export class upiLinkDTO {

    @IsNotEmpty()
    @IsInt()
    amount: number



}