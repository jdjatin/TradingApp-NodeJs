import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class faqDto {

    @ApiProperty()
    @IsNotEmpty()
    question:string;

    @ApiProperty()
    @IsNotEmpty()
    answer:string;
}