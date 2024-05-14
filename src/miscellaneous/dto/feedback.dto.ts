import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class FeedbackDto {

    @ApiProperty({example:"Adam"})
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(15)
    @ApiProperty({example:"+919898989898",description:"Write your number alongwith your country code"})
    phone_number:string;

    @IsNotEmpty()
    @ApiProperty({description:"Please explain your feedback here"})
    description:string;

}