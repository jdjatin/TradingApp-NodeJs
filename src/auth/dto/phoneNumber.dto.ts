import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsNegative, IsPositive } from "class-validator";

export class PhoneNumberDto {

    @ApiProperty({example:"9998889990"})
    @Length(10)
    @IsNotEmpty()
    phoneNumber:string;
}